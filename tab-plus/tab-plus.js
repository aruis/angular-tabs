/**
 * Created by liurui on 16/7/5.
 */
angular.module('tab.plus', ['ui.bootstrap'])
    .directive('tabPlus', function ($timeout) {
        return {
            require: '^uibTabset',
            link: function ($scope, element, attrs, tabsetCtrl) {

                var data

                $timeout(function () {
                    for (var i = 0; i < tabsetCtrl.tabs.length; i++) {
                        if (tabsetCtrl.tabs[i].tab == $scope) {
                            data = $scope.$parent.tabs[i]
                            $scope.isTack = data.isTack
                            break
                        }
                    }
                })


                $scope.tack = function () {
                    $scope.isTack = !$scope.isTack
                    data.tackFunction($scope.isTack)
                }

                $scope.closeTab = function () {

                    for (var i = 0; i < tabsetCtrl.tabs.length; i++) {
                        if (tabsetCtrl.tabs[i].tab == $scope) {
                            var isActive = $scope.active
                            $scope.$parent.closeTab(i)
                            $scope.$broadcast('$destroy')
                            if (isActive && tabsetCtrl.tabs.length > i)
                                tabsetCtrl.select(i);

                            data.closeFunction()
                            break
                        }
                    }

                }

            }
        }
    })
    .directive('tabsetPlus', function ($timeout, $compile, $templateCache) {

        return {
            restrict: 'E',
            scope: {
                tabs: '='
            },
            template: '<uib-tabset active="active" ng-show="tabs.length>0"></uib-tabset>',
            controller: function ($scope) {
                $scope.active = 0

                $scope.closeTab = function () {
                    alert('dd')
                }
            },
            controllerAs: 'ctrl',
            link: function ($scope, element) {
                var delIndex = 0
                $scope.closeTab = function (index) {
                    $scope.tabs.splice(index, 1)
                }

                $scope.$watchCollection('tabs', function (_new, _old) {

                    var i = 0

                    angular.forEach(_old, function (otab) {
                        var ofind = _.findIndex(_new, {
                            id: otab.id
                        });

                        if (ofind == -1) {
                            delIndex++
                            $(element).find('ul.nav.nav-tabs').children()[i].remove()
                        }
                        i++

                    })

                    var isAdd

                    angular.forEach(_new, function (tab) {
                        var find = _.findIndex(_old, {
                            id: tab.id
                        });

                        if (find == -1) {
                            isAdd = true
                            var templateUrl = tab.templateUrl
                            $(element).find('ul.nav.nav-tabs').append($compile('<uib-tab template-url="' + templateUrl + '" heading=\"' + tab.title + '\" >' + tab.html + '</uib-tab>')($scope));
                        }
                    })
                    if (isAdd) {
                        $timeout(function () {
                            $scope.active = _new.length - 1 + delIndex
                        })
                    }

                }, true)

            }
        }
    })
