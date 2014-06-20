from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
import json


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
                return HttpResponse(user.username)
            else:
                return HttpResponseBadRequest("inappropriate id or pw.")
    except:
        return HttpResponseBadRequest("inappropriate request.")


@login_required
def logout_user(request):
    logout(request)
    return render(request, 'index.html')


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
    trolling = Trolling (
        user = request.user,
        content = content,
    )
    trolling.save()
    
    return HttpResponse("write trolling success")
