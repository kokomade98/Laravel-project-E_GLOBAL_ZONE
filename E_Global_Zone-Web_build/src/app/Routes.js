import React, { useEffect } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { selectIsLogin, selectUser } from "redux/userSlice/userSlice";
import { useSelector, useDispatch } from "react-redux";

import MobileRouter from "app/Routers/Router.Mobile";
import { ManagerRouter, ForeignerRouter } from "app/Routers/Router.Web";
import { LoginRouter } from "app/Routers/Router.Login";
import conf from "../conf/conf";
import { logOut, setClass } from "redux/userSlice/userSlice";

/**
 * Routes for Routers
 * @returns {JSX.Element}
 * @constructor
 */
function Routes() {
	const isLogin = useSelector(selectIsLogin);
	const User = useSelector(selectUser);
	return (
		<Router>
			<Test />
			{isLogin ? (
			User.userClass === conf.userClass.KOREAN ? (
					//mobile
					<>
						<MobileRouter />
					</>
				) : User.userClass === conf.userClass.FOREIGNER ? (
					// web
					<ForeignerRouter />
				) : (
					// User === "Manager"
					<ManagerRouter />
				)
			) : (
				//notlogin
				<LoginRouter />
			)}
		</Router>
	);
}

const Test = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(selectUser);
	const student = () => {
		dispatch(setClass([user.id,conf.userClass.KOREAN]));
		history.push("/");
	};
	const foreigner = () => {
		dispatch(setClass([user.id,conf.userClass.FOREIGNER]));
		history.push("/");
	};
	const manager = () => {
		dispatch(setClass([user.id,conf.userClass.MANAGER]));
		history.push("/");
	};
	return (
		<div>
			<button onClick={student}>학생</button>
			<button onClick={foreigner}>유학생</button>
			<button onClick={manager}>관리자</button>
		</div>
	);
};

export default Routes;
