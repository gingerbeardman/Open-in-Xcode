function openInXcode() {
  if (!nova.workspace.path) {
    nova.workspace.showInformativeMessage(
      nova.localize("This workspace has no path.")
    );
    return;
  }

  var process = new Process("/usr/bin/open", {
    args: ["-a", "Xcode", nova.workspace.path],
  });

  var lines = [];

  process.onStderr(function (data) {
    if (data) {
      lines.push(data);
    }
  });

  process.onDidExit(function (status) {
    if (status != 0) {
      nova.workspace.showInformativeMessage(
        nova.localize("Error opening in Xcode:") +
          "\n\n" +
          lines.join("")
      );
    }
  });

  process.start();
}

exports.activate = function () {
  // Do work when the extension is activated
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
};

function findXcodeProject() {
  if (!nova.workspace.path) return null;

  var entries = nova.fs.listdir(nova.workspace.path);
  var xcworkspace = null;
  var xcodeproj = null;

  for (var i = 0; i < entries.length; i++) {
    if (entries[i].endsWith(".xcworkspace")) {
      xcworkspace = nova.path.join(nova.workspace.path, entries[i]);
    } else if (entries[i].endsWith(".xcodeproj")) {
      xcodeproj = nova.path.join(nova.workspace.path, entries[i]);
    }
  }

  return xcworkspace || xcodeproj;
}

function openFileInXcode() {
  var editor = nova.workspace.activeTextEditor;
  if (!editor || !editor.document.path) {
    nova.workspace.showInformativeMessage(
      nova.localize("No file is currently open.")
    );
    return;
  }

  var args = ["-a", "Xcode"];
  var project = findXcodeProject();
  if (project) {
    args.push(project);
  }
  args.push(editor.document.path);

  var process = new Process("/usr/bin/open", { args: args });

  var lines = [];

  process.onStderr(function (data) {
    if (data) {
      lines.push(data);
    }
  });

  process.onDidExit(function (status) {
    if (status != 0) {
      nova.workspace.showInformativeMessage(
        nova.localize("Error opening in Xcode:") +
          "\n\n" +
          lines.join("")
      );
    }
  });

  process.start();
}

nova.commands.register("xcode.openWorkspace", function () {
  openInXcode();
});

nova.commands.register("xcode.openFile", function () {
  openFileInXcode();
});
