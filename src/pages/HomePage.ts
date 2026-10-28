import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage / DashboardPage - Page Object for post-login landing page
 */
export class HomePage extends BasePage {
  // ─── Locators ───────────────────────────────────────────────────
  readonly welcomeMessage: Locator;
  readonly userAvatar: Locator;
  readonly userMenuDropdown: Locator;
  readonly logoutButton: Locator;
  readonly navigationMenu: Locator;
  readonly pageTitle: Locator;
  readonly notificationBell: Locator;
  readonly notificationBadge: Locator;

  constructor(page: Page) {
    super(page, '/');
    // ⚠️ UPDATE SELECTORS below after inspecting the actual website
    this.welcomeMessage     = page.locator('[data-testid="welcome-msg"], .welcome-text, h1');
    this.userAvatar         = page.locator('[data-testid="user-avatar"], .user-avatar, .avatar');
    this.userMenuDropdown   = page.locator('[data-testid="user-menu"], .user-dropdown, .profile-menu');
    this.logoutButton       = page.locator('[data-testid="logout-btn"], a:has-text("Logout"), a:has-text("Đăng xuất"), button:has-text("Logout")');
    this.navigationMenu     = page.locator('nav, .sidebar, .navigation');
    this.pageTitle          = page.locator('[data-testid="page-title"], h1, .page-title').first();
    this.notificationBell   = page.locator('[data-testid="notification-bell"], .notification-icon');
    this.notificationBadge  = page.locator('[data-testid="notification-badge"], .badge, .notification-count');
  }

  // ─── Actions ────────────────────────────────────────────────────

  async logout(): Promise<void> {
    await this.click(this.userAvatar);
    await this.click(this.logoutButton);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.isVisible(this.userAvatar);
  }

  async getWelcomeText(): Promise<string> {
    return this.getText(this.welcomeMessage);
  }

  async openNotifications(): Promise<void> {
    await this.click(this.notificationBell);
  }

  async getNotificationCount(): Promise<string> {
    return this.getText(this.notificationBadge);
  }

  async navigateTo(menuItem: string): Promise<void> {
    await this.page.locator(`nav a:has-text("${menuItem}"), .sidebar a:has-text("${menuItem}")`).click();
  }
}
