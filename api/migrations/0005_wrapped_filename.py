# Generated by Django 5.0 on 2024-01-27 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_wrapped_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='wrapped',
            name='filename',
            field=models.CharField(default=None, max_length=64, null=True),
        ),
    ]
