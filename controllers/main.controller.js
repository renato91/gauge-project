(function () {

  'use strict';

  var app = angular.module('gaugeApp');

  app.controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = ['$scope', '$http'];

  function mainCtrl($scope, $http) {
    var users = [];
    var interactions = [];

    getBrands();
    getUsers();
    getInteractions();

    $scope.mountGraphic = mountGraphic;

    function getBrands() {
      $http.get('data/brands.json').then(function (response) {
        $scope.brands = response.data;
      });
    }

    function getUsers() {
      console.log('oi')
      $http.get('data/users.json').then(function (response) {
        users = response.data;
      });
    }

    function getInteractions() {
      $http.get('data/interactions.json').then(function (response) {
        interactions = response.data;
      });
    }


    function mountGraphic(brandId) {
      $scope.isCreated = false;

      var filtered = filter(interactions, brandId);
      console.log('filter interactions', filtered.length);

      var mapped = mapByKey(filtered, 'user');
      console.log('map', mapped);

      var reduced = reduce(mapped);
      console.log('reduce', reduced);

      var mappedUsers = mapByKey(users, 'id');
      // console.log('mappedUsers', mappedUsers[18][0].name.first);

      var sorted = sort(reduced);
      // console.log('sort', sorted);


      $scope.labels = sorted.map(function (item) { return mappedUsers[item[0]][0].id });
      $scope.series = ['Series A', 'Series B'];

      $scope.data = sorted.map(function (item) { return item[1] });

      $scope.isCreated = true;
    }

    function filter(interactions, brand) {
      return interactions.filter(function (interaction) {
        return interaction.brand === brand;
      });
    }

    // function map(item) {
    //   return interactions.reduce(function (reduce, item) {
    //     if (!reduce[item.user]) {
    //       reduce[item.user] = [];
    //     }
    //     reduce[item.user].push(item);

    //     return reduce;
    //   }, {});
    // }

    function mapByKey(array, key) {
      return array.reduce(function (reduce, item) {
        if (!reduce[item[key]]) {
          reduce[item[key]] = [];
        }

        reduce[item[key]].push(item);

        return reduce;
      }, {});
    }

    function reduce(map) {
      var result = [];
      for (var key in map) {
        result.push([key, map[key].length]);
      }

      return result;
    }

    function sort(reduce) {
      return reduce.sort(function (a, b) {
        if (a[1] > b[1]) {
          return -1;
        }

        if (a[1] < b[1]) {
          return 1;
        }

        return 0;
      });
    }

    function getUserById(id) {
      return mapped[id];
    }



  }

})();