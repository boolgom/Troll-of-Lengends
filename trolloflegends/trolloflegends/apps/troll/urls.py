from django.conf.urls import patterns, include, url

from django.contrib import admin

urlpatterns = patterns('trolloflegends.apps',
    # Examples:
    # url(r'^$', 'trolloflegends.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'troll.views.index'),
)
