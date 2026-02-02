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

nova.commands.register("xcode.openWorkspace", function () {
  openInXcode();
});
