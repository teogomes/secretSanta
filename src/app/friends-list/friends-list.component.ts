import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import "firebase/database";
import { AngularFireDatabase } from "@angular/fire/database";
import { Friend } from "src/app/Models";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-friends-list",
  templateUrl: "./friends-list.component.html",
  styleUrls: ["./friends-list.component.css"],
})
export class FriendsListComponent implements OnInit {
  @Input() myNickname: string;

  pathName = "friends";
  roomID = "";
  link = environment.basePath + "/";
  amIAdmin = false;
  invitedFriends: Friend[] = [];

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");

    this.db
      .list(this.pathName)
      .valueChanges()
      .subscribe((res: Friend[]) => {
        let me = res.find((friend) => {
          return friend.ID == id;
        });
        this.roomID = me.roomID;
        this.amIAdmin = me.isAdmin;
        this.link += this.roomID;
        this.invitedFriends = res.filter(
          (friend) => friend.roomID == this.roomID
        );
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  copyMessage(val: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.openSnackBar("Copied: " + this.link, "Close");
  }

  match() {
    let unmatchedFriends = this.invitedFriends.filter(
      (friend) => friend.matchedWith == null
    );

    if (unmatchedFriends.length < 1) return;

    this.updateDB(
      unmatchedFriends[0].ID,
      this.getValidFriend(unmatchedFriends[0].ID).ID
    );
  }

  getValidFriend(currentID: string): Friend {
    let foreverAloneFriends = this.invitedFriends.filter((friend) => {
      !friend.matched && friend.matchedWith;
    });
    if (foreverAloneFriends.length == 1) return foreverAloneFriends[0];
    if (this.invitedFriends.filter)
      return this.shuffle(this.invitedFriends).find(
        (friend: Friend) => !friend.matched && friend.ID != currentID
      );
  }

  updateDB(currentID: string, matchedWithID: string) {
    this.db
      .object(`friends/${currentID}`)
      .update({ matchedWith: matchedWithID })
      .then(() => {
        this.db
          .object(`friends/${matchedWithID}`)
          .update({ matched: true })
          .then(() => {
            this.match();
          });
      });
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
