import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly form: pom.EditQuestionForm;
  readonly root: Locator;
  readonly answerInputs: Locator;
  readonly checkboxes: Locator;
  readonly addAnswerBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.form = new pom.EditQuestionForm(this.el);
    this.root = this.form.el.locator('.tce-multiple-choice');
    this.answerInputs = this.root.getByRole('textbox');
    this.checkboxes = this.root.getByRole('checkbox');
    this.addAnswerBtn = this.root.getByRole('button', { name: 'Add answer' });
  }
}
