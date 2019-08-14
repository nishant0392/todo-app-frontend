import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private userId: string;
  private authToken: string;
  private socket: any;
  private url = "http://api.nishant-kumar.com";

  private emittedData$: BehaviorSubject<any>;
  public isUsed: boolean;  // mechanism to allow only the first subscriber


  constructor(public http: HttpClient,
    public cookie: CookieService) {
    // Connection is being created (HTTP Handshake happens)
    this.socket = io(this.url);
    this.listenToOwnId();
    this.isUsed = false;
    this.userId = this.cookie.get('userId');
    this.authToken = this.cookie.get('authToken');
  }

  /* **** Listen to Own ID **** */
  public listenToOwnId() {

    this.emittedData$ = new BehaviorSubject({});

    let ownerId = this.cookie.get('userId');
    this.socket.on(ownerId, (data) => {
      this.isUsed = false;
      this.emittedData$.next(data);
    })
  }

  public subscribeToDataService(): Observable<object> {
      return this.emittedData$.asObservable();
  }

  /*   ==========   Events to be Listened   ==========   */

  public verifyUser() {
    return new Observable((observer) => {
      this.socket.on('verify-user', () => {
        observer.next();
      })
    });
  }

  public onlineUsersList() {
    return new Observable((observer) => {
      this.socket.on('online-users-list', (usersList: Object[]) => {
        observer.next(usersList);
      })
    });
  }

  public disconnectSocket() {
    return new Observable((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      })
    });
  }


  /*   ==========   Events to be Emitted   ==========   */

  public setUser(authToken) {

    this.socket.emit('set-user', authToken);

  }


  /*   ==========   Friend Request System   ==========   */


  /* OPCODE for Friend Requests:
        Send Friend Request: 'SEND',
        Accept Friend Request: 'ACCEPT',
        Reject Friend Request: 'REJECT'
  */
  public friendRequest(senderId: string, senderName: string,
    receiverId: string, receiverName: string, OPCODE: string) {

    const params = new HttpParams()
      .set('senderId', senderId)
      .set('senderName', senderName)
      .set('receiverId', receiverId)
      .set('receiverName', receiverName)
      // for Authorization
      .set('userId', this.userId)
      .set('authToken', this.authToken)

    switch (OPCODE) {
      case 'SEND': {
        return this.http.post(`${this.url}/api/v1/users/friend-request/send`, params);
      }
      case 'ACCEPT': {
        return this.http.post(`${this.url}/api/v1/users/friend-request/accept-reject/?OPCODE=ACCEPT`, params);
      }
      case 'REJECT': {
        return this.http.post(`${this.url}/api/v1/users/friend-request/accept-reject/?OPCODE=REJECT`, params);
      }
      default: {
        throw new Error('Invalid OPCODE');
      }
    } // END switch-case

  } // END friendRequest()

  /* Get all Friends for a User */
  public getAllFriends(authToken: string, userId: string): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/allFriends/?authToken=${authToken}&userId=${userId}`);
  }

  /* Get List of All Other Users excluding friends */
  public getAllNonFriends(authToken: string, userId: string): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/allNonFriends/?authToken=${authToken}&userId=${userId}`);
  } // END getAllUsers()


  /* Get all Friend Requests for a User */
  public getAllRequests(authToken: string, userId: string): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/friend-request/all/?authToken=${authToken}&userId=${userId}`);
  }

  /* Remove a friend */
  public removeFriend(authToken: string, userId: string, userName: string, friendId: string): Observable<any> {

    const params = new HttpParams()
      .set('userId', userId)
      .set('userName', userName)
      .set('friendId', friendId)

    return this.http.post(`${this.url}/api/v1/users/removeFriend/?authToken=${authToken}`, params);
  }

   /* Delete User Account */
   public deleteUserAccount(userId: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('password', password)
      .set('authToken', this.authToken)

    return this.http.post(`${this.url}/api/v1/users/account/delete`, params);
  }

} // THE END
