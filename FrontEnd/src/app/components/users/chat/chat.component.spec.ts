import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD:FrontEnd/src/app/components/users/chat/chat.component.spec.ts
import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatComponent ]
=======
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComponent ]
>>>>>>> master:FrontEnd/src/app/components/users/projects/list/list.component.spec.ts
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD:FrontEnd/src/app/components/users/chat/chat.component.spec.ts
    fixture = TestBed.createComponent(ChatComponent);
=======
    fixture = TestBed.createComponent(ListComponent);
>>>>>>> master:FrontEnd/src/app/components/users/projects/list/list.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
