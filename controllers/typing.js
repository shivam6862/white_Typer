const Results = require("../models/results");
const Calculation = require("../models/calculation");
const Histroy = require("../models/histroy");
const Reset = require("../models/reset");

var timing = 0;
let st = 0;
exports.getAddTyping = (req, res, next) => {
  const d = new Date();
  st = d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
  Reset.find({ userId: req.user._id })
    .then((reset) => {
      if (reset.length == 0) {
        console.log("Got the Empty Typing!");
        res.render("typing", {
          reset: reset,
          pageTitle: "Typing",
          path: "/admin/typing",
        });
      } else {
        console.log("Got the sentence to Type!");
        res.render("typing", {
          reset: reset[reset.length - 1],
          pageTitle: "Typing",
          path: "/admin/typing",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddDemoTyping = (req, res, next) => {
  res.render("demotyping", {
    pageTitle: "Demo_Typing",
    path: "/admin/demotyping",
  });
};

exports.postAddTyping = (req, res, next) => {
  const title = req.body.title;
  const d = new Date();
  let ft = d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
  timing = ft - st;
  const result = new Results({
    title: title,
    timing: timing,
    userId: req.user,
  });
  result
    .save()
    .then((result) => {
      console.log("Submitted answer");
      Reset.find({ userId: req.user._id })
        .then((reset) => {
          temp = reset[reset.length - 1].title;
          console.log("temp of RESET part of calling!");
          Results.find({ userId: req.user._id }).then((result) => {
            console.log("Doing the calculation");
            var title = result[result.length - 1].title;
            var timing = result[result.length - 1].timing;
            var wrongs = [];
            var correctwrong = [];
            var totalCorrect = 0;
            var totalWrong = 0;
            var totalSpeed = 0;
            var missword = 0;

            var v1 = [];
            var v2 = [];
            var str1 = "";
            var str2 = "";
            var temp = reset[reset.length - 1].title;
            temp += " ";

            var title = title + " ";
            var len = title.length;

            for (var i = 0; i < temp.length; i++) {
              if (temp[i] == " ") {
                if (str1.length > 0) v1.push(str1);
                str1 = "";
              } else {
                str1 += temp[i];
              }
            }

            for (var i = 0; i < title.length; i++) {
              if (title[i] == " ") {
                if (str2.length > 0) v2.push(str2);
                str2 = "";
              } else {
                str2 += title[i];
              }
            }

            var ct = 0;
            missword = v1.length - v2.length;

            var n, m;
            n = v1.length;
            m = v2.length;
            var dp = [[]];
            for (var i = 0; i <= n; i++) {
              var temp = [];
              for (var j = 0; j <= m; j++) {
                temp.push(0);
              }
              dp.push(temp);
            }

            for (var j = 0; j <= m; j++) dp[0][j] = 0;
            for (var i = 0; i <= n; i++) dp[i][0] = 0;
            for (var i = 1; i <= n; i++) {
              for (var j = 1; j <= m; j++) {
                if (v1[i - 1] == v2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
                else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
              }
            }
            ct = dp[n][m];

            var aa = 1;
            for (var j = 1; j < m + 1; j++) {
              if (dp[n - 1][j - 1] == dp[n - 1][j]) {
                let totalwrong = aa++ + " -- " + v2[j - 1];
                wrongs = [...wrongs, totalwrong];
              }
            }

            var bb = 1;
            for (var i = 1; i < n + 1; i++) {
              if (dp[i - 1][m - 1] == dp[i][m - 1]) {
                let totalcorrectwrong = bb++ + " -- " + v1[i - 1];
                correctwrong = [...correctwrong, totalcorrectwrong];
              }
            }

            totalCorrect = totalCorrect + +ct;
            totalWrong = v1.length - +ct - missword;
            totalSpeed = ((len / (timing * 5)) * 60).toFixed(4);

            const calculation = new Calculation({
              wrongs: wrongs,
              correctwrong: correctwrong,
              totalCorrect: totalCorrect,
              totalWrong: totalWrong,
              totalSpeed: totalSpeed,
              missword: missword,
              userId: req.user,
            });

            calculation
              .save()
              .then((result) => {
                console.log("Submitted calculation part of the user!");
              })
              .catch((err) => {
                console.log(err);
              });

            const date = new Date();
            let date1 =
              date.getDate() +
              "/" +
              date.getMonth() +
              "/" +
              date.getFullYear() +
              "  " +
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds();

            const finalhistroy = new Histroy({
              totalCorrect: totalCorrect,
              totalWrong: totalWrong,
              totalSpeed: totalSpeed,
              missword: missword,
              date: date1,
              userId: req.user,
            });

            finalhistroy
              .save()
              .then((result) => {
                console.log("Submitted final Histroy!");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        })
        .catch((err) => {
          console.log(err);
        });
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getFinalReset = (req, res, next) => {
  res.render("reset", {
    pageTitle: "Reset",
    path: "/admin/reset",
  });
};

exports.postFinalReset = (req, res, next) => {
  const reset = req.body.title;
  var reset1 = "";
  var ct = 0;
  for (var i = 0; i < reset.length; i++) {
    if (reset.charCodeAt(i) == 13 || reset.charCodeAt(i) == 10) {
      reset1 = reset1;
      ++ct;
    } else if (reset.charCodeAt(i) == 8217) {
      reset1 += "'";
    } else if (reset.charCodeAt(i) == 8212) {
      reset1 += "-";
    } else {
      if (ct == 2 && reset[i] != " ") {
        reset1 += " ";
        ct = 0;
      }
      reset1 += reset[i];
    }
    // console.log(reset.charCodeAt(i));
  }
  const finalreset = new Reset({
    title: reset1,
    userId: req.user,
  });
  finalreset
    .save()
    .then((result) => {
      console.log("Submitted Question");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
