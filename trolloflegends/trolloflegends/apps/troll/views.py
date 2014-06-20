from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    return render(request, 'index.html')

def login(request):
    try:
        if request.user.is_authenticated():
            return HttpResponseBadRequest("you have already logged in.")
        else:
            username = request.POST['username']
            password = request.POST['password']
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
    next = ""

    if request.GET:
        next = request.GET['next']

    return HttpResponseRedirect(next)
