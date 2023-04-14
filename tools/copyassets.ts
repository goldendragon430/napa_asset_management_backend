import * as shell from "shelljs";
//Copy all the view Templates
shell.cp("-R", "./views", "dist/");