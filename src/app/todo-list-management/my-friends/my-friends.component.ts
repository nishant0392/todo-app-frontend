import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.css']
})
export class MyFriendsComponent implements OnInit, OnDestroy {

  public userId: string;
  public userName: string;
  public authToken: string;
  public friendsList: Object[];
  public baseUrl: string;

  private subscription: Subscription;

  constructor(private cookie: CookieService,
    private toastr: ToastrService,
    private socketService: SocketService,
    private userManagementService: UserManagementService,
    private router: Router) { }

  ngOnInit() {
    this.userId = this.cookie.get('userId');
    this.userName = this.cookie.get('userName');
    this.authToken = this.cookie.get('authToken');
    this.friendsList = [];
    this.baseUrl = this.userManagementService.baseUrl;

    this.checkStatus();
    this.getAllFriends();
    this.listenToOwnId();
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

  /* *** Listen to own ID event *** */
  public listenToOwnId() {

    if (this.socketService.isUsed) return;

    this.subscription = this.socketService.subscribeToDataService()
      .subscribe((data: any) => {
        console.log("Received data from OwnID event:", data)
        if (!data) return;

        if (data.opcode === 'REQUEST') {
          this.toastr.info(data.senderName, 'New Friend Request:')
        }
        else if (data.opcode === 'ACCEPTED') {
          this.toastr.success(data.receiverName, 'You are now a FRIEND to:')
          this.getAllFriends();
        }
        else if (data.opcode === 'REJECTED') {
          this.toastr.info(data.receiverName, 'Friend Request rejected by:')
        }
        else if (data.opcode === 'REMOVED') {
          this.toastr.info(data.friendName, 'You have been removed by your friend:');
          this.getAllFriends();
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


  /* Get all friends for a User */
  public getAllFriends() {
    this.socketService.getAllFriends(this.authToken, this.userId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          console.log(apiResponse)
          this.friendsList = apiResponse.data;

          this.userManagementService.getAvatarsById(JSON.stringify(apiResponse.data))
            .subscribe((apiResponse2: any) => {
              console.log(apiResponse2)
              this.friendsList = apiResponse2.data;
            })
        }
          
        else if (apiResponse.status === 404)
          console.log(apiResponse.message)
        else
          this.toastr.error(apiResponse.message);
      })
  }

  /* Remove a friend */
  public removeFriend(friendId: string) {
    this.socketService.removeFriend(this.authToken, this.userId, this.userName, friendId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.info('Your Friend has been removed')
          this.getAllFriends();
        }
        else
          this.toastr.error(apiResponse.message);
      })
  }

  /* Show Items of a friend */
  public showFriendItems(friendId: string, friendName: string) {
    this.cookie.put('friendAccess', 'true');
    this.cookie.put('originalId', this.userId);
    this.cookie.put('originalName', this.userName);
    this.cookie.put('userId', friendId);
    this.cookie.put('userName', friendName);
    this.router.navigate(['/todo']);
  }

} // THE END
