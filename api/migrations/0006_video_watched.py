# Generated by Django 5.0.1 on 2024-01-27 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_wrapped_filename'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='watched',
            field=models.DateTimeField(default=None, null=True),
        ),
    ]
