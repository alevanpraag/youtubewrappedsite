# Generated by Django 5.0 on 2024-01-13 19:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_wrapped_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wrapped',
            name='file',
        ),
    ]