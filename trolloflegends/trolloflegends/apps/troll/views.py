from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from trolloflegends.apps.troll.models import Trolling, Report
import json
from django.core.serializers.json import DjangoJSONEncoder


# Create your views here.

def index(request):
    return render(request, 'main.html')


def statistics(request):
    return render(request, 'statistics.html')


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
    location = data['location']
    trolling = Trolling(
        user=request.user,
        content=content,
        location=location
    )
    trolling.save()

    return HttpResponse("write trolling success")


@login_required
def write_report(request):
    data = json.loads(request.body)
    content = data['content']
    trolling = data['trolling']
    print trolling
    print Trolling.objects.get(id=trolling)
    report = Report(
        user=request.user,
        content=content,
        parent=Trolling.objects.get(id=trolling)
    )
    report.save()

    return HttpResponse("write report success")


def get_trollings(request):
    trolling_list = []
    for trolling in Trolling.objects.all():
        isVote = ''
        if request.user in trolling.voters.all():
            isVote = 'true'
        trolling_obj = {
            'id': trolling.id,
            'content': trolling.content,
            'user': trolling.user.username,
            'datetime': trolling.written_time,
            'num_votes': trolling.num_votes,
            'location': trolling.location,
            'latitude': trolling.latitude,
            'longitude': trolling.longitude,
            'isVote': isVote
        }

        report_list = []
        for report in trolling.comments.all():
            report_obj = {
                'id': report.id,
                'username': report.user.username,
                'content': report.content,
                'datetime': report.written_time
            }
            report_list.append(report_obj)
        trolling_obj['reports'] = report_list

        trolling_list.append(trolling_obj)

    list_json = json.dumps(trolling_list, ensure_ascii=False, indent=4,
                           cls=DjangoJSONEncoder)

    return HttpResponse(list_json)


@login_required
def vote_trolling(request):
    data = json.loads(request.body)
    user = User.objects.get(id=request.user.id)
    trolling = data['trolling']
    trolling = Trolling.objects.get(id=trolling)

    if user in trolling.voters.all():
        trolling.voters.remove(user)
        trolling.num_votes -= 1
        trolling.save()
        return HttpResponse("unvote successful")
    else:
        trolling.voters.add(user)
        trolling.num_votes += 1
        trolling.save()
        return HttpResponse("vote successful")


# for testing front-end


def front_end(request):
    return render(request, 'main.html')
