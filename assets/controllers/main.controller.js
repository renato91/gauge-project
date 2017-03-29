(function () {

  'use strict';

  var app = angular.module('gaugeApp');

  app.controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = ['$scope', '$http'];

  function mainCtrl($scope, $http) {
    var users = [];
    var interactions = [];

    $scope.isCreated = false;
    $scope.mountGraphic = mountGraphic;

    getBrands();
    getUsers();
    getInteractions();

    function getBrands() {
      $http.get('assets/data/brands.json').then(function (response) {
        $scope.brands = response.data;
      });
    }

    function getUsers() {
      $http.get('assets/data/users.json').then(function (response) {
        users = response.data;
      });
    }

    function getInteractions() {
      $http.get('assets/data/interactions.json').then(function (response) {
        interactions = response.data;
      });
    }

    function mountGraphic(brandId) {
      var filtered = filter(interactions, brandId);
      var mappedInteractions = mapByKey(filtered, 'user');
      var reduced = reduce(mappedInteractions);
      var mappedUsers = mapByKey(users, 'id');
      var sorted = sort(reduced);


      $scope.labels = sorted.map(function (item) { return mappedUsers[item[0]][0].name.first });
      $scope.data = sorted.map(function (item) { return item[1] });
      $scope.isCreated = true;
    }

    function filter(interactions, brand) {
      return interactions.filter(function (interaction) {
        return interaction.brand === brand;
      });
    }

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

  }

})();