import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Company } from '../interfaces/company';
import { finalize, map } from 'rxjs';
import { User } from '../interfaces/user';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ChatfrService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    public storage: AngularFireStorage
  ) {
    // this.messagesCollection = this.firestore.collection('messages');
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 1000,
    });
  }

  createCompany(company: Company, chatRoom: string) {
    // Add a new document with a generated ID to the "companies" collection
    const companyRef = this.firestore
      .collection('companies')
      .doc(company.companyId.toString());
    const roomRef = companyRef.collection('rooms').doc(chatRoom);

    roomRef.set({ id: chatRoom }).then(() => {
      // Create a subcollection for messages within the room document
      return roomRef.collection('messages').add({
        content: 'Welcome to the room!',
        userId: 0,
        createdAt: new Date().toISOString(),
      });
    });
  }

  addRoom(company: Company, roomName: string) {
    // Get a reference to the "rooms" subcollection within the specified company document
    const roomsCollection = this.firestore.collection(
      `companies/${company.companyId}/rooms`
    );

    const roomRef = roomsCollection.doc(roomName);
    // Add a new document to the "rooms" subcollection

    roomRef.set({ id: roomName });
    return roomRef
      .collection('messages')
      .add({
        content: 'Welcome to the room!',
        userId: 0,
        createdAt: new Date(),
      })
      .then(() => {
        console.log('Room document created successfully.');
      })
      .catch((error) => {
        console.error('Error creating room document:', error);
      });
  }
  // addUsersToRoom(company: Company, roomName: string,users:User[]) {
  //   // Get a reference to the "rooms" subcollection within the specified company document
  //   const roomsCollection = this.firestore.collection(
  //     `companies/${company.companyId}/rooms`
  //   );

  //   const roomRef = roomsCollection.doc(roomName);
  //   // Add a new document to the "rooms" subcollection
  //   roomRef.update({users:users})
  // }
  async addUsersToRoom(company: Company, roomName: string, users: User[]) {
    const roomRef = this.firestore
      .collection(`companies/${company.companyId}/rooms`)
      .doc(roomName);

    try {
      const roomDoc = await roomRef.ref.get();

      if (roomDoc.exists) {
        const existingData = roomDoc.data() as { users?: User[] }; // Type assertion
        const existingUsers = existingData.users || [];

        // Filter out users that already exist in the room
        const uniqueUsers = users.filter(
          (newUser) =>
            !existingUsers.some(
              (existingUser) => existingUser.email === newUser.email
            )
        );
        if (uniqueUsers.length > 0) {
          const updatedUsers = [...existingUsers, ...uniqueUsers];
          await roomRef.update({ users: updatedUsers });
          this.openSnackBar('Users added successfully to the room.');
        } else {
          this.openSnackBar('All users are already in the room.');
        }
      } else {
        // If the room document doesn't exist, create it with the users
        await roomRef.set({ users: users });
        this.openSnackBar('Room created with users.');
      }
    } catch (error) {
      this.openSnackBar('Error adding users to the room:' + error);
    }
  }
  async createRoom(company: Company, roomName: string, users: User[]) {
    const roomRef = this.firestore
      .collection(`companies/${company.companyId}/rooms`)
      .doc(roomName);

    try {
      const roomDoc = await roomRef.ref.get();

      if (roomDoc.exists) {
        this.openSnackBar('Room already exists.');
      } else {
        // Create the room with the provided users
        await roomRef.set({ users: users });
        this.openSnackBar('Room created with users.');
      }
    } catch (error) {
      this.openSnackBar('Error creating room: ' + error);
    }
  }

  async removeUsersFromRoom(company: Company, roomName: string, users: User[]) {
    const roomRef = this.firestore
      .collection(`companies/${company.companyId}/rooms`)
      .doc(roomName);

    try {
      const roomDoc = await roomRef.ref.get();

      if (roomDoc.exists) {
        const existingData = roomDoc.data() as { users?: User[] }; // Type assertion
        let existingUsers = existingData.users || [];

        // Remove users from the existing users list
        existingUsers = existingUsers.filter(
          (existingUser) =>
            !users.some((newUser) => newUser.email === existingUser.email)
        );

        await roomRef.update({ users: existingUsers });
        this.openSnackBar('Users removed successfully from the room.');
      } else {
        this.openSnackBar('Room does not exist.');
      }
    } catch (error) {
      this.openSnackBar('Error removing users from the room: ' + error);
    }
  }

  async removeUserFromRoom(company: Company, roomName: string, user: User) {
    const roomRef = this.firestore
      .collection(`companies/${company.companyId}/rooms`)
      .doc(roomName);

    try {
      const roomDoc = await roomRef.ref.get();

      if (roomDoc.exists) {
        const existingData = roomDoc.data() as { users?: User[] }; // Type assertion
        let existingUsers = existingData.users || [];

        // Remove the specified user from the existing users list
        existingUsers = existingUsers.filter(
          (existingUser) => existingUser.email !== user.email
        );

        await roomRef.update({ users: existingUsers });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User removed successfully from the room.',
        });
        // this.openSnackBar('User removed successfully from the room.');
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Room does not exist.',
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'error',
      });
    }
  }

  async getUsersFromRoom(company: Company, roomName: string): Promise<User[]> {
    try {
      const roomRef = this.firestore
        .collection(`companies/${company.companyId}/rooms`)
        .doc(roomName);
      const roomDoc = await roomRef.ref.get();

      if (roomDoc.exists) {
        const roomData = roomDoc.data() as { users?: User[] };
        const users: User[] = roomData.users || []; // Assuming 'users' is an array field in the document

        return users;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warn',
          detail: 'Room does not exist.',
        });

        return []; // Return an empty array if the room doesn't exist or has no users
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error getting users from room:',
      });

      return []; // Return an empty array or handle the error accordingly
    }
  }

  sendMessageToGroup(company: Company, message: Message, room: string) {
    const messageId = this.firestore.createId();
    message.id = messageId;
    this.firestore
      .collection(`companies/${company.companyId}/rooms/${room}/messages`)
      .doc(messageId)
      .set(message);
  }

  getMessagesRoom(company: Company, room: string) {
    return (
      this.firestore
        .collection(
          `companies/${company.companyId}/rooms/${room}/messages`,
          (ref) => ref.orderBy('createAt')
        )
        // .orderBy('createdAt')
        .valueChanges()
    );
  }

  getRooms(company: Company) {
    return this.firestore
      .collection(`companies/${company.companyId}/rooms`)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const id = a.payload.doc.id;
            return id;
          })
        )
      );
    // .orderBy('createdAt')
  }

  getRoomsByUser(company: Company, user: User) {
    return this.firestore
      .collection(`companies/${company.companyId}/rooms`, (ref) =>
        ref.where('users', 'array-contains', user)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const id = a.payload.doc.id;
            return id;
          })
        )
      );
  }

  async removeMessage(
    company: Company,
    room: string,
    messageId: string,
    currentUser: User
  ) {
    const messageDoc = this.firestore.doc(
      `companies/${company.companyId}/rooms/${room}/messages/${messageId}`
    );

    const messageSnapshot = await messageDoc.get().toPromise();
    if (messageSnapshot?.exists) {
      const messageData = messageSnapshot.data() as Message;
      if (messageData.senderId === currentUser.userId) {
        await messageDoc.delete();
      } else {
        console.log('You are not authorized to delete this message.');
      }
    } else {
      console.log('Message not found.');
    }
  }

  uploadFile(file: File, path: string) {
    const filePath = `${path}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return task
      .snapshotChanges()
      .pipe(finalize(() => fileRef.getDownloadURL()));
  }
}

export interface Message {
  id?: string;
  content: string;
  senderId: number;
  senderName: string;
  createAt: Date;
  isFile:boolean;
}
