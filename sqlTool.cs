//Brook 2013-6-27
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
                    DefaultValue="GETDATE()"
                },
                new DataModel(){
                    ColumnID=7,
                    ColumnName="UpdateDate",
                    ColumnType=ColumnType.DATETIME.ToString(),
                    DefaultValue="GETDATE()"
                }
            };
            tsql.output(tsql.CreateTable(ColumnList), TSQL.outputPath, TSQL.dir, TSQL.tblName, ".sql");
            string procResult=TSQL.createTSQLHeader()+tsql.CreateProc(ColumnList,"create")+tsql.CreateProc(ColumnList,"delete")+tsql.CreateProc(ColumnList,"update")+tsql.CreateProc(ColumnList,"get");
            tsql.output(procResult ,TSQL.outputPath,TSQL.dir,TSQL.procName,".sql");
            Console.Write(tsql.CreateTable(ColumnList));
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

    public class TSQL
    {
        public static string outputPath = @"J:\Brook Tang\WorkTool\";
        public static string metaName = "ResearchBanner";
        public static string dbName = "[main_new]";
        public static string dir = metaName + @"\";
        public static string tblName = "ringier_T_" + metaName;
        public static string procName = "proc_"+metaName;
        public static string procCName = "Insert" + metaName;
        public static string procRName = "Get" + metaName;
        public static string procUName = "Update" + metaName;
        public static string procDName = "Delete" + metaName;
        public static string devName = "Brook";
        IList<DataModel> ColumnList;
        public TSQL()
        {

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

        public string CreateProc(List<DataModel> ColumnList, string operation)
        {
            string result = "";
            int columnCount=0;
            result += createSignature(TSQL.devName, operation + metaName, operation+" "+metaName);
            switch (operation)
            {
                case "create":
                    result+="CREATE PROC "+procCName+" \t";
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
                    columnCount=0;
                    foreach (DataModel column in ColumnList)
                    {
                        columnCount++;
                        if (!column.IsPrimaryKey)
                        {
                            result += "["+column.ColumnName+"]";
                        }
                        if (columnCount != ColumnList.Count&&!column.IsPrimaryKey)
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
                        if (columnCount != ColumnList.Count && !column.IsPrimaryKey)
                        {
                            result += ",";
                        }
                    }
                    result += ");\t";
                    result += "SET @sys_id=@@IDENTITY;\t";
                    result += "END\t";
                    result += "GO\t";
                    break;
                case "get": break;
                case "update": break;
                case "delete":
                    result += "CREATE PROC " + procDName + " \t";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "@"+column.ColumnName+" "+column.ColumnType+" \t";
                        }
                    }
                    result += "AS\t";
                    result += "BEGIN\t";
                    result += "DELETE FROM ["+tblName+"] WHERE ";
                    foreach (DataModel column in ColumnList)
                    {
                        if (column.IsPrimaryKey)
                        {
                            result += "[" + column.ColumnName + "]=" + "@"+column.ColumnName+" \t";
                        }
                    }
                    result += "END\t";
                    result += "GO\t";
                    ; break;
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
