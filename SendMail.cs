        public void SendWpDownloadMail(string senderMail, string senderName, string senderPassword, string receiverMail, string receiverName, string title, string content)
        {
            try
            {
                //下载模块 Brook 2013-4-12
                MailMessage mailMessage = new MailMessage();

                mailMessage.To.Add(senderMail);//添加发件人地址

                mailMessage.From = new MailAddress(senderMail, senderName, Encoding.UTF8);//发件人地址，发件人姓名，编码
                mailMessage.Subject =title; //邮件标题 
                mailMessage.SubjectEncoding = Encoding.UTF8;//邮件标题编码 
                mailMessage.Body =content;//邮件内容 
                mailMessage.BodyEncoding = Encoding.UTF8;//邮件内容编码 
                mailMessage.IsBodyHtml = true;//是否是HTML邮件 
                mailMessage.Priority = MailPriority.High;//邮件优先级
                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Credentials = new NetworkCredential(mailadress,pwd);
                smtpClient.Host = AppSettingControl.GetAppSetting("RegisterMailSmtpHost");
                smtpClient.Port = int.Parse(AppSettingControl.GetAppSetting("RegisterMailSmtpPort"));
                smtpClient.EnableSsl = true;
                mailMessage.To.Add(receiverMail);
                //mailMessage.To.Add("amyjiang@ringiertrade.com");//看需要解注释
                object UserState = mailMessage;
                smtpClient.SendAsync(mailMessage, UserState);
                
            }
            catch (Exception e)
            {
                throw ExceptionControl.Exception(e, "SendWpDownloadMail dal");
            }
        }
