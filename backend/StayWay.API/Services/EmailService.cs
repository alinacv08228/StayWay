using System.Net;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using StayWay.Domain.DTOs;

namespace StayWay.API.Services;

public class EmailService
{
    private readonly IConfiguration
        _configuration;

    public EmailService(
        IConfiguration configuration
    )
    {
        _configuration =
            configuration;
    }

    public async Task SendSupportMessageAsync(
        SupportMessageDto supportMessage
    )
    {
        var host =
            _configuration["Email:SmtpHost"]
            ?? "smtp.gmail.com";

        var port =
            int.TryParse(
                _configuration["Email:SmtpPort"],
                out var configuredPort
            )
                ? configuredPort
                : 587;

        var username =
            _configuration["Email:Username"]
            ?? throw new InvalidOperationException(
                "Email username is not configured."
            );

        var password =
            _configuration["Email:SmtpPassword"]
            ?? throw new InvalidOperationException(
                "Email SMTP password is not configured."
            );

        var fromEmail =
            _configuration["Email:FromEmail"]
            ?? username;

        var fromName =
            _configuration["Email:FromName"]
            ?? "StayWay Support";

        var toEmail =
            _configuration["Email:ToEmail"]
            ?? username;

        var email =
            new MimeMessage();

        email.From.Add(
            new MailboxAddress(
                fromName,
                fromEmail
            )
        );

        email.To.Add(
            MailboxAddress.Parse(
                toEmail
            )
        );

        email.ReplyTo.Add(
            new MailboxAddress(
                supportMessage.Name,
                supportMessage.Email
            )
        );

        var safeSubject =
            supportMessage.Subject
                .Replace("\r", " ")
                .Replace("\n", " ")
                .Trim();

        email.Subject =
            $"StayWay Support - {safeSubject}";

        var safeName =
            WebUtility.HtmlEncode(
                supportMessage.Name
            );

        var safeEmail =
            WebUtility.HtmlEncode(
                supportMessage.Email
            );

        var safeMessage =
            WebUtility.HtmlEncode(
                    supportMessage.Message
                )
                .Replace(
                    "\n",
                    "<br />"
                );

        var bodyBuilder =
            new BodyBuilder
            {
                TextBody =
                    $"""
                    New StayWay support message

                    Name: {supportMessage.Name}
                    Email: {supportMessage.Email}
                    Subject: {supportMessage.Subject}

                    Message:
                    {supportMessage.Message}
                    """,

                HtmlBody =
                    $"""
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 640px;
                        margin: 0 auto;
                        padding: 24px;
                        color: #2f2a38;
                    ">
                        <div style="
                            background: #6f4cff;
                            color: white;
                            padding: 18px 22px;
                            border-radius: 14px 14px 0 0;
                        ">
                            <h2 style="
                                margin: 0;
                                font-size: 22px;
                            ">
                                StayWay Support
                            </h2>
                        </div>

                        <div style="
                            border: 1px solid #e8e3f4;
                            border-top: none;
                            padding: 22px;
                            border-radius: 0 0 14px 14px;
                        ">
                            <p>
                                <strong>Name:</strong>
                                {safeName}
                            </p>

                            <p>
                                <strong>Email:</strong>
                                {safeEmail}
                            </p>

                            <p>
                                <strong>Subject:</strong>
                                {WebUtility.HtmlEncode(
                                    supportMessage.Subject
                                )}
                            </p>

                            <hr style="
                                border: 0;
                                border-top: 1px solid #eee8f7;
                                margin: 20px 0;
                            " />

                            <p>
                                <strong>Message:</strong>
                            </p>

                            <p style="
                                line-height: 1.6;
                            ">
                                {safeMessage}
                            </p>

                            <p style="
                                margin-top: 24px;
                                font-size: 12px;
                                color: #777182;
                            ">
                                User ID:
                                {WebUtility.HtmlEncode(
                                    supportMessage.UserId
                                )}
                            </p>
                        </div>
                    </div>
                    """
            };

        email.Body =
            bodyBuilder.ToMessageBody();

        using var smtpClient =
            new SmtpClient();

        smtpClient.CheckCertificateRevocation =
            false;

        smtpClient.Timeout =
            15000;

        await smtpClient.ConnectAsync(
            host,
            port,
            SecureSocketOptions.StartTls
        );

        await smtpClient.AuthenticateAsync(
            username,
            password
        );

        await smtpClient.SendAsync(
            email
        );

        await smtpClient.DisconnectAsync(
            true
        );
    }
}