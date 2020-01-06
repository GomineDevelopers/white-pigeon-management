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
  Message,
  Form,
  FormItem,
  Tooltip,
  Cascader,
  Progress,
  Image,
  Link,
  OptionGroup,
  Upload
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
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tooltip);
Vue.use(Cascader);
Vue.use(Progress);
Vue.use(Image);
Vue.use(Link);
Vue.use(OptionGroup);
Vue.use(Upload);
Vue.prototype.$messageBox = MessageBox;
Vue.prototype.$message = Message;
