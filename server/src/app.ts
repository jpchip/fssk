import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as mustacheExpress from "mustache-express";
import AuthController from "./components/auth";
import api from "./api";

/* tslint:disable */
const fs = require("fs");
const path = require("path");
/* tslint:enable */

const environment = process.env["NODE_ENV"];

const app: express.Application = express();

// include mustache template engine
app.engine("mst", mustacheExpress());
app.set("views", __dirname + "/views");
app.set("view engine", "mst");

// logging
if (environment === "development") {
	app.use(morgan("dev"));
} else {
	const logStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), {flags: "a"});
	app.use(morgan("combined", {stream: logStream}));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const authController = new AuthController();
authController.initialize(app);

// linked client dist directory
// if (environment === 'production') app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req: express.Request, res: express.Response) {
	res.render("index", { title: "FSSK", message: "Hello world!" });
});

app.use("/api/", api);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	const err = new Error("Not Found");
	err["status"] = 404;
	next(err);
});

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

	// set locals, only providing error in development
	res.locals.message = err.message || "Unknown error occurred";
	res.locals.error = req.app.get("env") === "development" ? err : {};


	// render the error page
	res.status(err.status || 500);
	if (req.get("Content-Type") === "application/json") {
		const errorJson: any = {
			code: err.status || 500,
			message: res.locals.message,
			error: res.locals.error,
		};
		res.json(errorJson);
	} else {
		res.render("error");
	}

});

module.exports = app;
