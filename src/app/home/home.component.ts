import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";

import "firebase/database";
import { AngularFireDatabase } from "@angular/fire/database";

@Component({
  selector: "Home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  nickname = "";
  roomID = "";
  linkForShare = "";
  isInvite = true;

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.roomID = this.route.snapshot.params.id || this.getUniqueId(1);
    this.linkForShare = environment.basePath + "/" + this.roomID;
  }

  postMyDataToFirebase() {
    this.db
      .list("friends")
      .push({
        nickname: this.nickname,
        roomID: this.roomID,
        isAdmin: !this.isInvite,
      })
      .then((res) => {
        this.db
          .object(`friends/${res["path"].pieces_[1]}`)
          .update({ ID: res["path"].pieces_[1] })
          .then(() => {
            this.router.navigate(["list", res["path"].pieces_[1]]);
          });
      });
  }

  getUniqueId(parts: number): string {
    this.isInvite = false;
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join("-");
  }
}
