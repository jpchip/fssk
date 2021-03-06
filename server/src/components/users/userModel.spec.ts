import BaseModel from "../base/baseModel";
import UserModel from "./userModel";

test("is a subclass of Base", () => {
	const model = new UserModel();
	expect(model instanceof BaseModel).toBeTruthy();
});

test("has the correct tableName", () => {
	const model = new UserModel();
	expect(model.tableName).toEqual("users");
});

test("defines the idAttribute", () => {
	const model = new UserModel();
	expect(model.idAttribute).toEqual("id");
});

test("has timestamps", () => {
	const model = new UserModel();
	expect(model.hasTimestamps).toBeTruthy();
});
