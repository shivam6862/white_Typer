const Calculation = require("../models/calculation");
const Histroy = require("../models/histroy");

exports.getStart = (req, res, next) => {
  res.render("start", {
    pageTitle: "White Typer",
    path: "/",
  });
};

exports.getFinalResult = (req, res, next) => {
  Calculation.find({ userId: req.user._id })
    .then((results) => {
      if (results.length == 0) {
        console.log("Got the Empty Result!");
        res.render("result", {
          prods: results,
          pageTitle: "Result",
          path: "/result",
        });
      } else {
        console.log("Got the Result!");
        res.render("result", {
          prods: results[results.length - 1],
          pageTitle: "Result",
          path: "/result",
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

const ITEMS_PER_PAGE = 1;

exports.getFinalHistroy = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Histroy.find({ userId: req.user._id })
    .countDocuments()
    .then((numHistroys) => {
      // console.log("user Histroy " + req.user._id);
      console.log("user Histroy ");
      totalItems = numHistroys;
      return Histroy.find({ userId: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((histroys) => {
      let histroys1 = histroys;
      console.log("Got the all histroy!");
      res.render("histroy", {
        histroys: histroys1,
        pageTitle: "Histroy",
        path: "/histroy",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteHistroy = (req, res, next) => {
  const prodId = req.body.histroyId;
  // console.log(prodId);
  console.log("Histroy is deleted!");

  Histroy.find({ userId: req.user._id })
    .then((histroys) => {
      var totalCorrect = 0;
      var totalWrong = 0;
      var totalSpeed = 0;
      var missword = 0;
      for (var i = 0; i < histroys.length; i++) {
        if (histroys[i]._id.valueOf().toString() === prodId.toString()) {
          totalCorrect = histroys[i].totalCorrect;
          totalWrong = histroys[i].totalWrong;
          totalSpeed = histroys[i].totalSpeed;
          missword = histroys[i].missword;
          Histroy.deleteOne({ _id: histroys[i]._id })
            .then(function () {
              console.log("Data deleted from histroy!");
            })
            .catch(function (error) {
              console.log(error);
            });
          // console.log(histroys[i]._id.valueOf().toString());
        }
      }
      Calculation.find({ userId: req.user._id })
        .then((errors) => {
          for (var i = 0; i < errors.length; i++) {
            if (
              totalCorrect == errors[i].totalCorrect &&
              totalWrong == errors[i].totalWrong &&
              totalSpeed == errors[i].totalSpeed &&
              missword == errors[i].missword
            ) {
              Calculation.deleteOne({ _id: errors[i]._id })
                .then(function () {
                  console.log("Data deleted from errors also!!!");
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }
        })
        .catch((err) => console.log(err));
      res.redirect("/histroy");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
