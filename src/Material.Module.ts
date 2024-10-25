import { NgModule } from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  exports: [MatInputModule, MatTooltipModule, MatButtonModule],
})
export class MaterialModule {}