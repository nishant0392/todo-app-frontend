import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';

import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/services/socket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserManagementService } from 'src/app/services/user-management.service';



@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.css']
})
export class InviteFriendsComponent implements OnInit, AfterContentInit, OnDestroy {

  public authToken: string;
  public userId: string;
  public userName: string;
  public usersList: Object[];
  public addFriendList: Object[];
  public requestsList: Object[];
  public baseUrl: string;

  private subscription: Subscription;

  constructor(private socketService: SocketService,
    private userManagementService: UserManagementService,
    private cookie: CookieService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.authToken = this.cookie.get('authToken');
    this.userId = this.cookie.get('userId');
    this.userName = this.cookie.get('userName');
    this.addFriendList = [];
    this.requestsList = [];
    this.baseUrl = this.userManagementService.baseUrl;

    this.checkStatus();
    this.verifyUserConfirmation();

    this.listenToOwnId();
  }

  ngAfterContentInit() {
    this.getAllRequests();
    this.getAllNonFriends();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  /* Check whether the User is authorized or not */
  public checkStatus() {
    let authToken = this.cookie.get('authToken');
    if (authToken === null || authToken === undefined || authToken === "") {
      this.toastr.error("Authorization Token Missing");
      this.router.navigate(['/login']);
    }
  }

  /* Verify User */
  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);
      });
  }


  /* *** Listen to own ID event *** */
  public listenToOwnId() {

    if(this.socketService.isUsed) return;
   
    this.subscription = this.socketService.subscribeToDataService()
      .subscribe((data: any) => {
        console.log("Received data from OwnID event:", data)

        if (!data) return;
    
        if (data.opcode === 'REQUEST') {
          this.toastr.info(data.senderName, 'New Friend Request:')

          setTimeout(() => { this.getAllRequests(); }, 1000)
        }
        else if (data.opcode === 'ACCEPTED') {
          this.toastr.success(data.receiverName, 'You are now a FRIEND to:')

          // Update Find Friends List
          setTimeout(() => { this.getAllNonFriends(); }, 1000)
        }
        else if (data.opcode === 'REJECTED') {
          this.toastr.info(data.receiverName, 'Friend Request rejected by:')

          // Update Find Friends List
          setTimeout(() => { this.getAllNonFriends(); }, 1000)
        }
        else if (data.opcode === 'REMOVED') {
          this.toastr.info(data.friendName, 'You have been removed by your friend:');

          // Update Find Friends List
          setTimeout(() => { this.getAllNonFriends(); }, 1000)
        }
        else if (data.opcode === 'TODO_MODIFIED') {
          if (this.cookie.get('friendAccess') === 'true') return;

          this.toastr.info(data.friendName, `Your List '${data.listName}' was modified by your friend:`);
        }
        else if (data.opcode === 'TODOLISTS_MODIFIED') {
          if (this.cookie.get('friendAccess') === 'true') return;

          this.toastr.info(data.friendName, `NEW List added by your friend:`);
        }
        else {
          console.log("Unknown opcode");
          return;
        }
          // set the flag 'isUsed'
         this.socketService.isUsed = true;
      })

  } // END listenToOwnId()

  /* Send Friend Request */
  public sendFriendRequest(receiver: any) {
    receiver.status = 'disabled';
    this.socketService.friendRequest(this.userId, this.userName, receiver.userId, receiver.userName, 'SEND')
      .subscribe((apiResponse: any) => {
        if (apiResponse.status === 200)
          this.toastr.success(receiver.userName, 'Friend Request Sent to:')
        else {
          this.toastr.error(apiResponse.message)
          receiver.status = 'enabled';
        }
      }, (error: any) => {
        console.log(error)
        this.toastr.error('Server did not respond.', 'Friend Request could not be sent !!')
        receiver.status = 'enabled';
      })

  } // END sendFriendRequest()

  /* Accept/Reject Friend Request */
  public acceptOrRejectRequest(senderId: string, senderName: string, OPCODE: string) {
    this.socketService.friendRequest(senderId, senderName, this.userId, this.userName, OPCODE)
      .subscribe((apiResponse: any) => {
        if (apiResponse.status === 200) {
          setTimeout(() => { this.getAllRequests(); }, 500)
          if (OPCODE === 'ACCEPT') {
            this.toastr.info(senderName, 'You are now a FRIEND to:')
          }
          // Update Find Friends List
          setTimeout(() => { this.getAllNonFriends(); }, 1000)
        }
        else
          this.toastr.error(apiResponse.message)
      })
      
  } // END acceptOrRejectRequest()


  /* Get List of All Other Users excluding friends */
  public getAllNonFriends() {
    this.socketService.getAllNonFriends(this.authToken, this.userId)
      .subscribe((apiResponse) => {
        console.log(apiResponse)

        if (apiResponse.data) 
          this.addFriendList = apiResponse.data;  
        else  
          this.toastr.error(apiResponse.message);
      })
  }

  /* Get List of Friend Requests for a User */
  public getAllRequests() {
    this.socketService.getAllRequests(this.authToken, this.userId)
      .subscribe((apiResponse: any) => {

        if (apiResponse.status === 200) {
          console.log(apiResponse)
          this.requestsList = apiResponse.data;

          this.userManagementService.getAvatarsById(JSON.stringify(apiResponse.data))
            .subscribe((apiResponse2: any) => {
              this.requestsList = apiResponse2.data;
            })
        }
          
        else if (apiResponse.status === 404)
          this.requestsList = [];
        else {
          console.log(apiResponse)
          this.toastr.error(apiResponse.message);
        }
      })
  }

} // THE END




