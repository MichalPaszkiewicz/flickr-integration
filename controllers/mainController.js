var blah = {};

angular.module('app').controller('mainController', function ($scope, $http, $location, $sce) {

    $scope.posts = {};

    $scope.postFilter = "";

    $scope.currentPost = {};
    $scope.currentTags = {};
    
    $scope.to_trusted = function (html_code) {
        var splitCode = html_code.split("</a>");
        var goodText = splitCode.slice(2).join("").replace("<p></p>", "");

        return $sce.trustAsHtml(goodText);
    }

    $scope.moveTo = function (item) {
        $scope.currentPost = item;

        //convert to object
        var tagList = item.tags.split(" ");
        var objectTagList = [];
        for (var i = 0; i < tagList.length; i++) {
            objectTagList.push({name: tagList[i]})
        }

        $scope.currentTags = objectTagList;

        $location.path("details")
    }

    $scope.tag = "astrophotography"

    var jsonFlickrFeed = function (data) {
        blah = data;
        $scope.posts = data.items;
    }

    $scope.authorName = function (author) {
        return author.substring(author.indexOf("(")).replace(/[()]/g, "");
    }

    $scope.getFeed = function (tag) {
        $location.path("home")

        if (tag != null) {
            $scope.tag = tag
        }

        $http.get(serverURL + $scope.tag).success(function (data) {
            eval(data);
        }).error(function (data) {
            console.log(data);
        });
    }

    $scope.getFeed();

});