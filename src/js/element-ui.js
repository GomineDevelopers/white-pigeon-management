import Vue from "vue";
import {
  Button,
  Input,
  Select,
  Option,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  submenu,
  MenuItem,
  MenuItemGroup,
  Table,
  TableColumn,
  Pagination,
  Loading,
  Dialog,
  MessageBox,
  Message 
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Col);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Loading);
Vue.use(Dialog);
Vue.prototype.$messageBox = MessageBox;
Vue.prototype.$message = Message;