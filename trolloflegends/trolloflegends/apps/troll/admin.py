from django.contrib import admin
from trolloflegends.apps.troll.models import Trolling, Report

# Register your models here.

class TrollingAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'user', 'num_votes',)
    ordering = ('id',)

class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'user', 'num_votes',)
    ordering = ('id',)

admin.site.register(Trolling, TrollingAdmin)
admin.site.register(Report, ReportAdmin)
