from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Trolling(models.Model):
    user = models.ForeignKey(User, related_name="trollings")
    content = models.TextField()
    written_time = models.DateTimeField()
    num_votes = models.IntegerField()
    voters = models.ManyToManyField(User, related_name="voted_trollings")
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    image = models.ImageField(upload_to="images")

class Report(models.Model):
    user = models.ForeignKey(User, related_name="reports")
    content = models.TextField()
    written_time = models.DateTimeField()
    num_votes = models.IntegerField()
    voters = models.ManyToManyField(User, related_name="voted_reports")

