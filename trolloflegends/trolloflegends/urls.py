from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'trolloflegends.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', include('trolloflegends.apps.troll.urls')),
    url(r'^login/$', 'trolloflegends.apps.troll.views.login_user'),
    url(r'^logout/$', 'trolloflegends.apps.troll.views.logout_user'),
    url(r'^register/$', 'trolloflegends.apps.troll.views.register_user'),
    url(r'^getuser/$', 'trolloflegends.apps.troll.views.get_user'),
    url(r'^write_trolling/$', 'trolloflegends.apps.troll.views.write_trolling'),
    url(r'^write_report/$', 'trolloflegends.apps.troll.views.write_report'),
    url(r'^get_trollings/$', 'trolloflegends.apps.troll.views.get_trollings'),
    url(r'^vote_trolling/$', 'trolloflegends.apps.troll.views.vote_trolling'),

    # Media path
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),

    url(r'^admin/', include(admin.site.urls)),

    # for testing front-end
    url(r'^front-end/$', 'trolloflegends.apps.troll.views.front_end'),
)
