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
                            $scope.data = data
                            $scope.isTack = data.isTack
                            $scope.isFixed = data.isFixed
                            break
                        }
                    }

                    data.$scope = $scope

                    tabsetPlusCtrl.$scope.$watch('active', function (value) {
                        if (value === $scope.index) {
                            data.selectFunction(data)
                        }
                    })

                    $scope.$watch('data.isFixed', function (value) {
                        $scope.isFixed = value
                    })

                    $scope.$watch('data.isTack', function (value) {
                        $scope.isTack = value
                    })


                })

                $scope.tack = function () {
                    $scope.isTack = !$scope.isTack
                    data.tackFunction($scope.isTack, data)
                }

                $scope.closeTab = function (auto) {

                    for (var i = 0; i < tabsetCtrl.tabs.length; i++) {
                        if (tabsetCtrl.tabs[i].tab == $scope) {
                            var isActive = $scope.active

                            if (!auto)
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
    .directive('tabsetPlus', function ($timeout, $compile) {

        return {
            restrict: 'E',
            scope: {
                tabs: '=',
                scope: '='
            },
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
                            otab.$scope.closeTab(true)
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
                            $(element).find('ul.nav.nav-tabs').append($compile('<uib-tab template-url="' + templateUrl + '" heading=\"' + tab.title + '\" >' + tab.html + '</uib-tab>')($scope.scope));
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
