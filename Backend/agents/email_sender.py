from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatOpenAI(model="gpt-3.5-turbo")

# @tool
def emailer_tool(receiver_address: str, message_body: str, email_subject: str):
    """email the reciver with the given message"""
    try:
        email_host = os.getenv("EMAIL_HOST")
        email_port = int(os.getenv("EMAIL_PORT"))
        email_user = os.getenv("EMAIL_USER")
        email_pass = os.getenv("EMAIL_PASS")
        print(email_host, email_pass, email_port, email_user)
        msg = MIMEMultipart()
        msg["From"] = email_user
        msg["To"] = receiver_address
        msg["Subject"] = email_subject
        message_body = message_body.strip('"').strip("'")
        msg.attach(MIMEText(message_body, "html"))

        with smtplib.SMTP(email_host, email_port) as server:
            server.starttls()
            server.login(email_user, email_pass)
            server.send_message(msg)
        print(receiver_address)
        return f"Summary successfully sent to {receiver_address}"
    
    except Exception as e:
        print(str(e))
        return f"Failed to send email: {str(e)}"


email_agent = create_react_agent(
    model=llm,
    tools=[emailer_tool],
    prompt = (
"You are an intelligent email assistant.\n\n"
"Your job is to send professional, personalized, and clearly written emails using the tool `emailer_tool`.\n\n"
"Workflow:\n"
"1. Understand the user's request and intent.\n"
"2. Generate a formal and polite email with:\n"
"   - A subject line that matches the purpose.\n"
"   - A professional greeting (e.g., 'Dear Professor [Name],')\n"
"   - A structured body (reason, context, courtesy, and action)\n"
"   - A closing line (e.g., 'Thank you for your time.')\n"
"   - A signature 'Regards, Modit Agrawal'\n\n"
"3. Use proper grammar, sentence structure, and email etiquette.\n\n"
"4. Call the tool `emailer_tool` with:\n"
"   - `receiver_address`: email of the recipient\n"
"   - `email_subject`: subject of the email\n"
"   - `message_body`: full HTML-formatted message (with <p>, <br>, etc.)\n\n"
"📌 Example format for message_body:\n"
"<p style=""margin: 0 0 16px 0;"">Dear Professor Sharma,</p>\n"
"<p style=""margin: 0 0 16px 0;"">\n"
"I hope you are doing well. I am writing to inform you that I am experiencing a fever and will not be able to attend class on July 11th and 12th.</p>\n"
"<p style=""margin: 0 0 16px 0;"">Thank you for your understanding.</p>\n"
"<p style=""margin: 0;"">Regards,<br>Modit Agrawal</p>\n"
"❌ Do not return or print the email text.\n"
"✅Strictly Use 20px margin for <p>\n"
"🚫 Do not wrap the email body in quotes when calling `emailer_tool`.\n"
"✅ Only call `emailer_tool` with the 3 required fields."
),
    name="email_agent"
)

if __name__ == "__main__":
    prompt = "Send an email to moditag21@gmail.com saying something like developers job is gonna end soon, ai will take over them"
    result = email_agent.invoke({"messages": [{"role": "user", "content": prompt}]})
    print(result)
