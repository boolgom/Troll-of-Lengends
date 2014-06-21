from django.conf.urls import patterns, url

urlpatterns = patterns('trolloflegends.apps',
    # Examples:
    # url(r'^$', 'trolloflegends.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'troll.views.front_end'),
    url(r'^write_trolling/$', 'troll.views.write_trolling'),
)
