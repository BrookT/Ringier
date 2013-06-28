//Brook 2013-6-28 11:26
//Brook 2013-6-28 15:38 Modify for extension of js,model

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Data;

namespace workTools
{


    class Program
    {
        static void Main(string[] args)
        {
            TSQL tsql = new TSQL();
            List<DataModel> ColumnList = new List<DataModel>() { 
                new DataModel(){
                    ColumnID=0,
                    ColumnName="ID",
                    ColumnType=ColumnType.INT.ToString(),
                    NotAllowNull=true,
                    IsPrimaryKey=true,
                    IsAutoGrow=true
                },
                new DataModel(){
                    ColumnID=1,
                    ColumnName="PageName",
                    ColumnType=ColumnType.NVARCHAR20.ToString()
                },
                new DataModel(){
                    ColumnID=2,
                    ColumnName="SiteID",
                    ColumnType=ColumnType.INT.ToString()
                },
                new DataModel(){
                    ColumnID=3,
                    ColumnName="Language",
                    ColumnType=ColumnType.NVARCHAR20.ToString()
                },
                new DataModel(){
                    ColumnID=4,
                    ColumnName="Content",
                    ColumnType=ColumnType.NTEXT.ToString()
                },
                new DataModel(){
                    ColumnID=5,
                    ColumnName="IsDisplay",
                    ColumnType=ColumnType.BIT.ToString()
                },
                new DataModel(){
                    ColumnID=6,
                    ColumnName="CreateDate",
                    ColumnType=ColumnType.DATETIME.ToString(),
                    DefaultValue="GETDATE()",
                    IsCreateTime=true
                },
                new DataModel(){
                    ColumnID=7,
                    ColumnName="UpdateDate",
                    ColumnType=ColumnType.DATETIME.ToString(),
                    DefaultValue="GETDATE()",
                    IsUpdateTime=true
                }
            };
            Console.WriteLine("Creating ...");
            tsql.output(tsql.CreateTable(ColumnList), TSQL.outputPath, TSQL.dir, TSQL.tblName, ".sql");
            string procResult = TSQL.createTSQLHeader() + tsql.CreateProc(ColumnList, "create") + tsql.CreateProc(ColumnList, "delete") + tsql.CreateProc(ColumnList, "update") + tsql.CreateProc(ColumnList, "get") + tsql.CreateProc(ColumnList, "getList");
            tsql.output(procResult, TSQL.outputPath, TSQL.dir, TSQL.procName, ".sql");
            tsql.output(tsql.CreateCSharp(ColumnList, "Model"), TSQL.outputPath, TSQL.dir, TSQL.metaName + "Model", ".cs");
            tsql.output(tsql.CreateCSharp(ColumnList, "DAL"), TSQL.outputPath, TSQL.dir, TSQL.metaName + "DAL", ".cs");
            tsql.output(tsql.CreateCSharp(ColumnList, "BLL"), TSQL.outputPath, TSQL.dir, TSQL.metaName + "BLL", ".cs");
            tsql.output(tsql.CreateCSharp(ColumnList, "webservice"), TSQL.outputPath, TSQL.dir, TSQL.metaName + "WS", ".asmx.cs");
            tsql.output(tsql.CreateJS(ColumnList),TSQL.outputPath,TSQL.dir,TSQL.metaName+"Package",".js");
            Console.Write("complete!");
            Console.ReadKey();
        }
    }

    public class DataModel
    {
        public int ColumnID { get; set; }

        public string ColumnName { get; set; }

        public string ColumnType
        {
            get;
            set;
        }

        public bool NotAllowNull { get; set; }

        public bool IsPrimaryKey { get; set; }

        public bool IsAutoGrow { get; set; }

        public string DefaultValue { get; set; }

        public bool IsUpdateTime { get; set; }

        public bool IsCreateTime { get; set; }
    }

    public class ColumnType
    {
        public static string INT = "int";
        public static string BIT = "bit";
        public static string NTEXT = "NTEXT";
        public static string NVARCHAR20 = "NVARCHAR(20)";
        public static string NVARCHAR8 = "NVARCHAR(8)";
        public static string NVARCHAR255 = "NVARCHAR(255)";
        public static string NVARCHARMAX = "NVARCHAR(max)";
        public static string DATETIME = "DateTime";
    }



    public interface ICreateFile
    {
        void output(string content, string pathName, string dir, string fileName, string ex);
    }

    public class CreateFile : ICreateFile
    {
        public void output(string content, string pathName, string dir, string fileName, string ex)
        {
            if (!Directory.Exists(pathName + dir))
            {
                Directory.CreateDirectory(pathName + dir);
            }
            StreamWriter sw = new StreamWriter(pathName + dir + fileName + ex);
            string[] line = content.Split('\t');
            foreach (string temp in line)
            {
                sw.WriteLine(temp);
            }
            sw.Close();
        }
    }

    public class TSQL
    {
        public static string outputPath = @"J:\Brook Tang\WorkTool\";
        public static string metaName = "ResearchBanner";
        public static string dbName = "[main_new]";
        public static string dir = metaName + @"\";
        public static string tblName = "ringier_T_" + metaName;
        public static string procName = "proc_" + metaName;
        public static string procCName = "Insert" + metaName;
        public static string procRName = "Get" + metaName;
        public static string procUName = "Update" + metaName;
        public static string procDName = "Delete" + metaName;
        public static string procGLName = "Get" + metaName + "List";
        public static string devName = "Brook";
        IList<DataModel> ColumnList;
        public TSQL()
        {

        }

        public string CreateJS(List<DataModel> ColumnList)
        {
            string result = "";
            result+=CreateJSSignature(TSQL.devName,metaName);
             result += "var " + metaName + "Request={\t";//request start
            result += "     list:function(postData){Post.Ajax(postData,'" + procGLName + "'," + metaName + "CallBack.list," + metaName + "Callback.error);},\t";
            result += "     item:function(postData){Post.Ajax(postData,'" + procRName + "'," + metaName + "Callback.item," + metaName + "Callback.error);},\t";
            result += "     insert:function(postData{Post.Ajax(postData,'" + procCName + "'," + metaName + "Callback.insert," + metaName + "Callback.error);},\t";
            result += "     update:function(postData){Post.Ajax(postData,'" + procUName + "'," + metaName + "Callback.update," + metaName + "Callback.error);},\t";
            result += "     delete:function(postData){Post.Ajax(postData,'" + procDName + "'," + metaName + "Callback.delete," + metaName + "Callback.error);}\t";
            result += "}\t";//request end
            result += "var " + metaName + "CallBack={\t";//callback start
            result += "     list:function(result){result=result.d;if(result.Flag){}},\t";
            result += "     item:function(result){result=result.d;if(result.Flag){}},\t";
            result += "     update:function(result){result=result.d;if(result.Flag){}},\t";
            result += "     insert:function(result){result=result.d;if(result.Flag){}},\t";
            result += "     delete:function(result){result=result.d;if(result.Flag){}},\t";
            result += "}\t";//callback end
            return result;
        }



        public string CreateTable(List<DataModel> ColumnList)
        {
            int columnCount = 0;
            string result = "";
            result += createTSQLHeader();
            result += createSignature("Brook", "Create Ringier_T_" + metaName, "create table ringier_T_" + metaName);
            result += "CREATE TABLE " + tblName + "(\t";
            foreach (DataModel column in ColumnList)
            {
                columnCount++;
                result += column.ColumnName + " " + column.ColumnType + " ";
                if (column.IsPrimaryKey)
                {
                    result += "PRIMARY KEY ";
                }
                if (column.NotAllowNull)
                {
                    result += "NOT NULL ";
                }
                if (column.IsAutoGrow)
                {
                    result += "IDENTITY(1,1) ";
                }
                if (column.DefaultValue != null)
                {
                    result += "DEFAULT(" + column.DefaultValue + ") ";
                }
                if (columnCount != ColumnList.Count)
                {
                    result += ",";
                }
                result += "\t";
            }
            result += ")\t";

            return result;
        }

        public string CreateCSharp(List<DataModel> ColumnList, string CSharpFileName)
        {
            string result = "";
            switch (CSharpFileName)
            {
                case "Model": result = CreateCSharpModel(ColumnList); break;
                case "DAL": result = CreateCSharpDAL(ColumnList); break;
                case "BLL": result = CreateCSharpBLL(ColumnList); break;
                case "webservice": result = CreateCSharpWS(ColumnList); break;
            }
            return result;
        }

        public string CreateCSharpModel(List<DataModel> ColumnList)
        {
            string result = "";
            result += "using System;\t";
            result += "using System.Collections.Generic;\t";
            result += "using System.Text;\t";
            result += "namespace Models\t";
            result += "{\t";//namespace start
            result += "public class " + metaName + "Model \t";
            result += " {";//class start
            foreach (DataModel column in ColumnList)
            {
                result += "     public " + ParseSqlTypeIntoCSharpType(column.ColumnType) + " " + column.ColumnName + "{    get;set;    }\t";
            }
            result += " }\t";//class end
            result += "}\t";//namespace end
            return result;
        }

        public string CreateCSharpDAL(List<DataModel> ColumnList)
        {
            string result = "";
            return result;
        }

        public string CreateCSharpBLL(List<DataModel> ColumnList)
        {
            string result = "";
            return result;
        }

        public string CreateCSharpWS(List<DataModel> ColumnList)
        {
            string result = "";
            return result;
        }

        public string CreateProc(List<DataModel> ColumnList, string operation)
        {
            string result = "";
            int columnCount = 0;
            result += createSignature(TSQL.devName, operation + metaName, operation + " " + metaName);
            switch (operation)
            {
                case "create":
                    result += "CREATE PROC " + procCName + " \t";
                    foreach (DataModel column in ColumnList)
                    {
                        columnCount++;
                        if (column.IsPrimaryKey)
                        {
                            result += "@sys_id int out ";
                        }
                        else
                        {
                            result += "@" + column.ColumnName + " " + column.ColumnType + " ";
                        }
                        if (columnCount != ColumnList.Count)
                        {
                            result += ",";
                        }
                        result += "\t";
                    }
                    result += "AS\t";
                    result += "BEGIN\t";
                    result += "INSERT INTO [" + tblName + "] (";
                    columnCount = 0;
                    foreach (DataModel column in ColumnList)
                    {
                        columnCount++;
                        if (!column.IsPrimaryKey)
                        {
                            result += "[" + column.ColumnName + "]";
                        }
                        if (columnCount != ColumnList.Count && !column.IsPrimaryKey)
                        {
                            result += ",";
                        }
                    }
                    result += ")";
                    result += " values ( ";
                    foreach (DataModel column in ColumnList)
                    {
                        columnCount++;
                        if (!column.IsPrimaryKey)
                        {
                            result += "@" + column.ColumnName + "";
                        }
                        if (columnCount != ColumnList.Count && !column.IsPrimaryKey && columnCount != ColumnList.Count)
                        {
                            result += ",";
                        }
                    }
                    result += ");\t";
                    result += "SET @sys_id=@@IDENTITY;\t";
                    result += "END\t";
                    result += "GO\t\t";
                    break;
                case "get":
                    result += "CREATE PROC " + procRName + "\t";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "@" + column.ColumnName + " " + column.ColumnType + "\t";
                        }
                    }
                    result += "AS\t";
                    result += "BEGIN\t";
                    result += "SELECT * FROM [" + tblName + "] WHERE ";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "@" + column.ColumnName + "=" + column.ColumnName + ";\t";
                        }
                    }
                    result += "END\t";
                    result += "GO\t";
                    ; break;
                case "getList":
                    result += "CREATE PROC " + procGLName + "\t";
                    List<DataModel> ColumnTemp = new List<DataModel>();
                    foreach (DataModel column in ColumnList)
                    {
                        if (!column.IsPrimaryKey && !column.IsCreateTime && !column.IsUpdateTime)
                        {
                            ColumnTemp.Add(column);
                        }
                    }
                    columnCount = 0;
                    foreach (DataModel column in ColumnTemp)
                    {
                        result += "@" + column.ColumnName + " " + column.ColumnType + " ,\t";
                    }
                    result += "@StartRowID int,\t";
                    result += "@EndRowID int \t";
                    result += "AS\t";
                    result += "BEGIN\t";
                    result += "DECLARE @SQL NVARCHAR(4000)='';\t";
                    result += "DECLARE @WHERE NVARCHAR(4000)='';\t";
                    result += "DECLARE @ORDER NVARCHAR(4000)='';\t";
                    result += "SET @SQL=@SQL+'SELECT * from [" + tblName + "]' \t";
                    result += "SET @WHERE=@WHERE+'WHERE 1=1 ' \t";
                    result += "SET @ORDER=@ORDER+'ORDER BY \t";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "[" + column.ColumnName + "] desc,";
                        }
                        if (column.IsCreateTime)
                        {
                            result += "[" + column.ColumnName + "] desc,";
                        }
                        if (column.IsUpdateTime)
                        {
                            result += "[" + column.ColumnName + "] desc'\t";
                        }
                    }
                    foreach (DataModel column in ColumnList)
                    {
                        string obj_temp;
                        if (!column.IsPrimaryKey && !column.IsUpdateTime && !column.IsCreateTime)
                        {
                            if (IsTypeStringable(column.ColumnType))
                            {
                                obj_temp = "@" + column.ColumnName + "";
                            }
                            else
                            {
                                obj_temp = "CONVERT(NVARCHAR(20),@" + column.ColumnName + ")";
                            }
                            result += "IF(LTRIM(RTRIM(ISNULL(" + obj_temp + ",''))))<>''\t";
                            result += "BEGIN\t";
                            if (IsTypeStringable(column.ColumnType))
                            {
                                result += "SET @WHERE=@WHERE+' AND [" + column.ColumnName + "]='''+" + obj_temp + "+''' ';\t";
                            }
                            else
                            {
                                result += "SET @WHERE=@WHERE+' AND [" + column.ColumnName + "]='+" + obj_temp + "+ ' ';\t";
                            }
                            result += "END\t";
                        }
                    }
                    result += "SET @SQL=@SQL+@WHERE+@ORDER;\t";
                    result += "EXEC (@SQL);\t";
                    result += "END\t";
                    result += "GO\t\t";
                    break;
                case "update":
                    result += "CREATE PROC " + procUName + " \t";
                    columnCount = 0;
                    foreach (DataModel column in ColumnList)
                    {
                        columnCount++;
                        result += "@" + column.ColumnName + " " + column.ColumnType + "";
                        if (columnCount == ColumnList.Count)
                        {
                            result += ",";
                        }
                        result += "\t";
                    }
                    result += "AS\t";
                    result += "BEGIN\t";
                    result += "UPDATE [" + tblName + "] SET \t";
                    columnCount = 0;
                    foreach (DataModel column in ColumnList)
                    {
                        columnCount++;
                        if (!column.IsPrimaryKey && !column.IsUpdateTime && !column.IsCreateTime)
                        {
                            result += "[" + column.ColumnName + "]=@" + column.ColumnName + "";
                        }
                        else if (column.IsUpdateTime)
                        {
                            result += "[" + column.ColumnName + "]=" + column.DefaultValue + "";
                        }
                        if (columnCount != ColumnList.Count && !column.IsPrimaryKey)
                        {
                            result += ",";
                        }
                        result += "\t";
                    }
                    result += " WHERE \t";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "@" + column.ColumnName + "=" + column.ColumnName + "\t";
                        }
                    }
                    result += "END\t";
                    result += "GO\t\t";
                    break;
                case "delete":
                    result += "CREATE PROC " + procDName + " \t";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "@" + column.ColumnName + " " + column.ColumnType + " \t";
                        }
                    }
                    result += "AS\t";
                    result += "BEGIN\t";
                    result += "DELETE FROM [" + tblName + "] WHERE ";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "[" + column.ColumnName + "]=" + "@" + column.ColumnName + " \t";
                        }
                    }
                    result += "END\t";
                    result += "GO\t\t";
                    ; break;
            }
            return result;
        }

        public static bool IsTypeStringable(string type)
        {
            bool result = false;
            switch (type)
            {
                case "int":
                case "bit":
                case "DateTime": result = false; break;
                case "NTEXT":
                case "NVARCHAR(20)":
                case "NVARCHAR(8)":
                case "NVARCHAR(255)":
                case "NVARCHAR(max)": result = true; break;
                default: break;
            }
            return result;
        }

        public static string ParseSqlTypeIntoCSharpType(string type)
        {
            string result = "";
            switch (type)
            {
                case "int": result = "int"; break;
                case "bit": result = "bool"; break;
                case "DateTime": result = "DateTime"; break;
                case "NTEXT":
                case "NVARCHAR(20)":
                case "NVARCHAR(8)":
                case "NVARCHAR(255)":
                case "NVARCHAR(max)": result = "string"; break;
                default: break;
            }
            return result;
        }

        public static string createTSQLHeader()
        {
            string result = "";
            result += "USE " + dbName + "\t";
            result += "go\t";
            result += "SET ANSI_NULLS ON\t";
            result += "GO\t";
            return result;
        }

        public string createSignature(string devName, string procName, string description)
        {
            string result = "";
            result += "--===================================\t";
            result += "-- Author : " + devName + "\t";
            result += "-- Create Date : " + DateTime.Now + "\t";
            result += "-- Proc Name : " + procName + "\t";
            result += "-- Description : " + description + "\t";
            result += "--===================================\t";
            return result;
        }

        public string CreateJSSignature(string devName, string description)
        {
            string result = "";
            result += "//   Author : " + devName + "\t";
            result += "//   Create Date : " + DateTime.Now + "\t";
            result += "//   Description : " + description + "\t";
            result += "//   FileName : " + metaName + "Package.js" + "\t";
            return result;
        }

        public void output(string content, string pathName, string dir, string fileName, string ex)
        {
            if (!Directory.Exists(pathName + dir))
            {
                Directory.CreateDirectory(pathName + dir);
            }
            StreamWriter sw = new StreamWriter(pathName + dir + fileName + ex);
            string[] line = content.Split('\t');
            foreach (string temp in line)
            {
                sw.WriteLine(temp);
            }
            sw.Close();
        }
    }
}
