import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "Home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  nickname = "";
  id = "";
  isInvite = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id || this.getUniqueId(1);
  }

  goToList() {
    this.router.navigate(["list", this.nickname, this.id]);
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
