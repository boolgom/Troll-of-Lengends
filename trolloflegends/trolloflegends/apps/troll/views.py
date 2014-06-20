from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from trolloflegends.apps.troll.models import Trolling
import json
from django.core.serializers.json import DjangoJSONEncoder


# Create your views here.

def index(request):
    return render(request, 'index.html')


def login_user(request):
    try:
        if request.user.is_authenticated():
            return HttpResponseBadRequest("you have already logged in.")
        else:
            data = json.loads(request.body)
            username = data['username']
            password = data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                response_data = {'username': request.user.username}
                return HttpResponse(json.dumps(response_data),
                                    content_type="application/json")
            else:
                return HttpResponseBadRequest("inappropriate id or pw.")
    except:
        return HttpResponseBadRequest("inappropriate request.")


@login_required
def logout_user(request):
    logout(request)
    return HttpResponse('success')


def register_user(request):
    try:
        if request.user.is_authenticated():
            return HttpResponseBadRequest("you have already registered")
        else:
            data = json.loads(request.body)
            username = data['username']
            password = data['password']
            print username
            print password
            user = User.objects.create_user(username=username,
                                            email=None, password=password)
            user.save()
            user = authenticate(username=username, password=password)
            login(request, user)
            return HttpResponse(user.username)
    except:
        return HttpResponseBadRequest("failed to register")


def get_user(request):
    response_data = {'username': request.user.username}
    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


@login_required
def write_trolling(request):
    data = json.loads(request.body)
    content = data['content']
    trolling = Trolling(
        user=request.user,
        content=content,
    )
    trolling.save()

    return HttpResponse("write trolling success")


def get_trollings(request):
    trolling_list = []
    print trolling_list
    print Trolling.objects.all()
    for trolling in Trolling.objects.all():
        trolling_obj = {
            'id': trolling.id,
            'content': trolling.content,
            'user': trolling.user.username,
            'datetime': trolling.written_time,
            'num_votes': trolling.num_votes,
            'location': trolling.location,
            'latitude': trolling.latitude,
            'longitude': trolling.longitude,
        }
        trolling_list.append(trolling_obj)
        print trolling_obj

    list_json = json.dumps(trolling_list, ensure_ascii=False, indent=4,
                           cls=DjangoJSONEncoder)

    return HttpResponse(list_json)
