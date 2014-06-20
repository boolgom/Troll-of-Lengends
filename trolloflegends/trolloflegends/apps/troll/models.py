from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Trolling(models.Model):
    user = models.ForeignKey(User, related_name='trollings')
    content = models.TextField()
    written_time = models.DateTimeField(auto_now_add=True)
    num_votes = models.IntegerField(default=0)
    voters = models.ManyToManyField(User, related_name='voted_trollings', null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    image = models.ImageField(upload_to='images', null=True, blank=True)

class Report(models.Model):
    user = models.ForeignKey(User, related_name='reports')
    content = models.TextField()
    written_time = models.DateTimeField(auto_now_add=True)
    num_votes = models.IntegerField(default=0)
    voters = models.ManyToManyField(User, related_name='voted_reports', null=True, blank=True)
    parent = models.ManyToManyField('Trolling', related_name='comments')

