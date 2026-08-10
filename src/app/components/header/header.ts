import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SystemStatus } from '../../models/monolith.model';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  systemInfo = input<SystemStatus | null>(null);
  activeTab = input<string>('dashboard');
  tabChange = output<string>();

  selectTab(tab: string): void {
    this.tabChange.emit(tab);
  }
}
