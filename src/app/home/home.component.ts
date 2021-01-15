import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";

import "firebase/database";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { resolve } from "@angular/compiler-cli/src/ngtsc/file_system";

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
  showLoader = false;

  selectedFile: File = null;
  downloadURL: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    private route: ActivatedRoute,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.roomID = this.route.snapshot.params.id || this.getUniqueId(1);
    this.linkForShare = environment.basePath + "/" + this.roomID;
  }

  postMyDataToFirebase() {
    this.showLoader = true;
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
            this.uploadFile(res["path"].pieces_[1]);
            this.router.navigate(["list", res["path"].pieces_[1]]);
          });
      });
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(id) {
    return new Promise((resolve) => {
      var n = Date.now();
      const file = this.selectedFile;

      if (file == null) {
        return resolve("");
      }

      const filePath = `RoomsImages/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`RoomsImages/${n}`, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe((url) => {
              debugger;
              if (url) {
                this.db.object(`friends/${id}`).update({ imageURL: url });
              }
            });
          })
        )
        .subscribe((url) => {
          if (url) {
          }
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
