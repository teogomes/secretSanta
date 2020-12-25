import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { FriendsListComponent } from "./friends-list/friends-list.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: ":id", component: HomeComponent },
  { path: "list/:id", component: FriendsListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
