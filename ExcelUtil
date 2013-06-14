using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Web;
using System.Net;

namespace RMS.Utility
{
    public class Output
    {
        /// <summary>
        /// 创建excel并提供下载
        /// </summary>
        /// <param name="ds">结果集</param>
        /// <param name="FileName">生成的文件名</param>
        public static void CreateExcel(System.Web.UI.Page page,DataSet ds, string FileName)
        {
            page.Response.Clear();
            page.Response.Buffer = true;
            HttpResponse resp;
            resp = page.Response;
            resp.ContentEncoding = System.Text.Encoding.GetEncoding("GB2312");
            resp.AppendHeader("Content-Disposition", "attachment;filename=" + FileName);
            resp.ContentType = "application/vnd.ms-excel";
            page.EnableViewState = false;

            string colHeaders = "", Is_item = "";

            //定义表对象与行对象，同时用DataSet对其值进行初始化
            DataTable dt = ds.Tables[0];
            DataRow[] myRow = dt.Select();
            int i = 0;
            int cl = dt.Columns.Count;

            //取得数据表各列标题，各标题之间以t分割，最后一个列标题后加回车符
            for (i = 0; i < cl; i++)
            {
                if (i == (cl - 1))
                {
                    colHeaders += dt.Columns[i].Caption.ToString() + "\n";
                }
                else
                {
                    colHeaders += dt.Columns[i].Caption.ToString() + "\t";
                }
            }
            resp.Write(colHeaders);
            //向HTTP输出流中写入取得的数据信息

            //逐行处理数据
            foreach (DataRow row in myRow)
            {
                //当前行数据写入HTTP输出流，并且置空Is_item以便下行数据
                for (i = 0; i < cl; i++)
                {
                    if (i == (cl - 1))//最后一列加n
                    {
                        Is_item += row[i].ToString() + "\n";
                    }
                    else
                    {
                        Is_item += row[i].ToString() + "\t";
                    }
                }
                resp.Write(Is_item);
                Is_item = "";
            }
            resp.End();
        }
    }
}
