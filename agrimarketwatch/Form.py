from flask.ext.wtf import Form
from wtforms import TextField, BooleanField, TextAreaField
from wtforms.validators import Required, Email

class LoginForm(Form):
    """ The form to be used to validate user logins into the application"""
    openid = TextField('openid', validators = [Required()])
    remember_me = BooleanField('remember_me', default = False)

class ContactUsForm(Form):
    """ The form to facilitate contact information input """
    email = TextField('email', validators = [Required(), Email()])
    message = TextAreaField('message', validators = [Required()])


