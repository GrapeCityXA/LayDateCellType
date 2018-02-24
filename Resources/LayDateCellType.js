var LayDateCellType = (function (_super) {
    __extends(LayDateCellType, _super);
    function LayDateCellType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }

    //自定义的属性
    LayDateCellType.prototype.OADateValue = null;

    //父类CellTypeBase上的方法
    LayDateCellType.prototype.createContent = function () {
        var self = this;

        var element = this.CellElement;
        var cellTypeMetaData = element.CellType;
        var container = $("<div id='" + this.ID + "'></div>");

        var innerContainer = $('<input type="text" id=' + this.ID + '_laydate />');
        innerContainer.css("width", element.Width);
        innerContainer.css("height", element.Height);
        innerContainer.css("box-sizing", "border-box");
        innerContainer.css("border", "0px");
        innerContainer.css("outline", "none");

        var hAlign = this.getHorizontalAlignment(element.StyleInfo);
        if (hAlign) {
            innerContainer.css("text-align", hAlign);
        }

        container.append(innerContainer);

        return container;
    }

    //自定义的方法
    LayDateCellType.prototype.getHorizontalAlignment = function (styleInfo) {
        if (styleInfo) {
            if (styleInfo.HorizontalAlignment === Forguncy.CellHorizontalAlignment.Left) {
                return "left";
            } else if (styleInfo.HorizontalAlignment === Forguncy.CellHorizontalAlignment.Center) {
                return "center";
            } else if (styleInfo.HorizontalAlignment === Forguncy.CellHorizontalAlignment.Right) {
                return "right";
            }
        }

        return null;
    }

    //父类CellTypeBase上的方法
    LayDateCellType.prototype.getValueFromElement = function () {
        return this.OADateValue;
    }

    //父类CellTypeBase上的方法
    LayDateCellType.prototype.setValueToElement = function (element, value) {
        if (!(value instanceof Date)) {
            if (typeof (value) === "number") {
                value = Forguncy.ConvertOADateToDate(value);
            } else {
                try {
                    value = new Date(value);
                } catch (e) {
                    value = null;
                }
            }
        }

        var info = this.getDateCellTypeTypeAndFormat();
        var type = info.type;
        var format = info.format;

        if (value == null) {
            laydate.render({
                elem: "#" + this.ID + "_laydate",
                type: type,
                format: format
            });
        } else {
            laydate.render({
                elem: "#" + this.ID + "_laydate",
                type: type,
                format: format,
                value: value
            });
        }
    }

    //父类CellTypeBase上的方法
    LayDateCellType.prototype.getDefaultValue = function () {
        var cellTypeMetaData = this.CellElement.CellType;
        var defaultValue = cellTypeMetaData.DefaultValue;

        return {
            Value: defaultValue
        };
    }

    //父类CellTypeBase上的方法
    LayDateCellType.prototype.onLoad = function () {
        var info = this.getDateCellTypeTypeAndFormat();
        var type = info.type;
        var format = info.format;

        var self = this;
        laydate.render({    //laydate.js类库中的参数
            elem: "#" + this.ID + "_laydate",
            type: type,
            format: format,
            done: function (value, date, endDate) {
                var newValue = Forguncy.ConvertDateToOADate(new Date(date.year, date.month - 1, date.date, date.hours, date.minutes, date.seconds));
                if (type === "time") {
                    newValue = newValue % 1;
                } else if (type === "date") {
                    newValue = Math.floor(newValue);
                }
                self.OADateValue = newValue;
                self.commitValue();    //提交数据层数据
            }
        });
    }

    //自定义的方法
    LayDateCellType.prototype.getDateCellTypeTypeAndFormat = function () {
        var cellTypeMetaData = this.CellElement.CellType;
        var type = "date";
        var format = "yyyy-MM-dd";
        if (cellTypeMetaData.LayDateMode === LayDateMode.Time) {
            type = "time";
            format = "HH:mm:ss";
        } else if (cellTypeMetaData.LayDateMode === LayDateMode.DateTime) {
            type = "datetime";
            format = "yyyy-MM-dd HH:mm:ss";
        }

        return {
            type: type,
            format: format
        };
    }

    return LayDateCellType;
}(Forguncy.CellTypeBase));

//与c#端数据保持一致
var LayDateMode = {
    Date: 0,
    Time: 1,
    DateTime: 2
};

// Key format is "Namespace.ClassName, AssemblyName"
Forguncy.CellTypeHelper.registerCellType("LayDateCellType.LayDateCellType, LayDateCellType", LayDateCellType);