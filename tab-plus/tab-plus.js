/**
 * Created by liurui on 16/7/5.
 */
angular.module('tab.plus', ['ui.bootstrap'])
    .directive('tabPlus', function ($timeout) {
        return {
            require: ['^uibTabset', '^tabsetPlus'],
            link: function ($scope, element, attrs, ctrls) {

                var data

                var tabsetCtrl = ctrls[0]
                var tabsetPlusCtrl = ctrls[1]

                $timeout(function () {
                    for (var i = 0; i < tabsetCtrl.tabs.length; i++) {
                        if (tabsetCtrl.tabs[i].tab == $scope) {
                            data = tabsetPlusCtrl.tabs[i]
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
                            tabsetPlusCtrl.$scope.closeTab(i)
                            $scope.$broadcast('$destroy')
                            if (isActive && tabsetCtrl.tabs.length > i)
                                tabsetCtrl.select(i);

                            data.closeFunction(data)
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
                tabs: '=',
                scope: '='
            },
            require: 'tabsetPlus',
            template: '<uib-tabset active="active" ng-show="tabs.length>0"></uib-tabset>',
            controller: function ($scope) {
                this.$scope = $scope
            },
            link: function ($scope, element, attrs, ctrl) {
                var delIndex = 0
                $scope.closeTab = function (index) {
                    $scope.tabs.splice(index, 1)
                }

                $scope.$watchCollection('tabs', function (_new, _old) {

                    ctrl.tabs = _new

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
                            $(element).find('ul.nav.nav-tabs').append($compile('<uib-tab template-url="' + templateUrl + '" select="tabSelect(' + tab.id + ')" heading=\"' + tab.title + '\" >' + tab.html + '</uib-tab>')($scope.scope));
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
