from django.db import models
from django.contrib.auth.modles import User

# Create your models here.
class Trolling(models.Model):
    user = models.ForeignKey(User, related_name="trollings")
    content = models.TextField()
    written_time = models.DateTimeField()
    num_votes = models.IntegerField()
    voters = models.ManyToManyField(User, related_names="voted_trollings")
    latitude = models.DecimalField()
    longitude = models.DecimalField()
    image = models.ImageField()

class Report(models.Model):
    user = models.ForeignKey(User, related_name="reports")
    content = models.TextField()
    written_time = models.DateTimeField()
    num_votes = models.IntegerField()
    voters = models.ManyToManyField(User, related_names="voted_reports")

