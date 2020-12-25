import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import "firebase/database";
import { AngularFireDatabase } from "@angular/fire/database";
import { Friend } from "src/app/Models";

@Component({
  selector: "app-friends-list",
  templateUrl: "./friends-list.component.html",
  styleUrls: ["./friends-list.component.css"],
})
export class FriendsListComponent implements OnInit {
  @Input() myNickname: string;

  pathName = "friends";
  roomID = "";
  link = "localhost:4200/";
  dataPosted = false;
  invitedFriends: Friend[] = [];

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.roomID = this.route.snapshot.paramMap.get("id");
    this.link += this.roomID;
    this.db
      .list(this.pathName)
      .valueChanges()
      .subscribe((res: Friend[]) => {
        this.invitedFriends = res.filter(
          (friend) => friend.roomID == this.roomID
        );
        if (!this.dataPosted) this.postMyDataToFirebase();
      });
  }

  postMyDataToFirebase() {
    this.dataPosted = true;

    let nickname = this.route.snapshot.paramMap.get("nickname");

    if (this.invitedFriends.find((friend) => friend.nickname == nickname))
      return;

    this.db
      .list("friends")
      .push({ nickname: nickname, roomID: this.roomID })
      .then((res) => {
        this.db
          .object(`${this.pathName}/${res["path"].pieces_[1]}`)
          .update({ ID: res["path"].pieces_[1] });
      });
  }

  // openSnackBar(message: string, action: string) {
  //   this.snackBar.open(message, action, {
  //     duration: 2000,
  //   });
  // }

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
    // this.openSnackBar("Link coppied", "Close");
  }
}
