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
    url(r'^getuser/$', 'trolloflegends.apps.troll.views.get_user'),

    # Media path
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),

    url(r'^admin/', include(admin.site.urls)),
)
