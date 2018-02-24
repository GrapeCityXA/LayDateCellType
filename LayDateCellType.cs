using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace LayDateCellType
{
    [Icon("pack://application:,,,/LayDateCellType;component/Resources/LayDateIcon.png")]
    public class LayDateCellType : CellType, ISupportStyleInitialize, IReferenceFormula
    {
        [DisplayName("默认值")]
        [FormulaProperty]
        public object DefaultValue
        {
            get;
            set;
        }
        [DisplayName("选择模式")]
        public LayDateMode LayDateMode
        {
            get;
            set;
        }
        public override string ToString()
        {
            return "Lay日期";
        }


        public override DisplayBehaviour DisplayBehaviour
        {
            get
            {

                return DisplayBehaviour.KeepBorderWhenMerge;
            }
        }
        public Dictionary<StylePropertyName, object> GetDefaultStyleInfos(ICellInfo cellInfo)
        {
            var styles = new Dictionary<StylePropertyName, object>();
            //默认情况下LayDateCellType右对齐
            styles.Add(StylePropertyName.HorizontalAlignment, ForguncyCellHorizontalAlignment.Right);
            return styles;
        }
        public IEnumerable<LocatedObject<object>> GetFormulaReferObjects(LocationIndicator location)
        {
            yield return new LocatedObject<object>(this.DefaultValue, location.AppendProperty("默认值"));
        }
    }

    public enum LayDateMode
    {
        [Description("日期")]
        Date,
        [Description("时间")]
        Time,
        [Description("日期&时间")]
        DateTime
    }
}
